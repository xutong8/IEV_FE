import PolyGrid from "./PolyGrid";
import { scaleLinear } from "d3-scale";
import { useEffect, useMemo, useState } from "react";
import { max } from "lodash";
import Axis, { DirectionValue } from "../../Axis";
import RadarArea from "./RadarArea";
import { nameToIDObj } from "@/constants/nameMapToID";
import { reqRadarData } from "@/services/api";
import { IRadarChart } from "..";
import rangeWithLen from "@/utils/rangeWithLen";
import { colorMap } from "@/utils/generateCountryColor";

export interface IRadar {
  svgWidth: number;
  svgHeight: number;
  title: string;
  color: string | undefined;
}

export interface IRadarItem {
  axisname: string;
  value: number;
}
// TODO: 实现数据Scale range 取整10 算法; 配色方案; tooltip接入; 接入全局的year
const Radar: React.FC<IRadar> = (props) => {
  const { svgWidth, svgHeight, title, color } = props;
  const [data, setData] = useState<Array<IRadarItem>>([]);
  const width = svgWidth;
  const height = svgHeight;
  const level = 4;
  const sides = useMemo(() => data.length, [data]);
  const size = useMemo(() => Math.min(width, height), [width, height]);
  const r = 0.8 * size;
  const r_0 = r / 2;
  const center = {
    x: size / 2,
    y: size / 2,
  };
  const offset = Math.PI;
  const polyangle = (Math.PI * 2) / sides;
  const nameToID = nameToIDObj;

  const maxValue: number = useMemo(() => {
    const maxNum = max(data.map((item) => item.value));

    return maxNum ? Math.ceil(maxNum * 10) / 10 : 0;
  }, [data]);

  const tickValues = useMemo(() => {
    return rangeWithLen(0, maxValue, level + 1);
  }, [maxValue]);
  // const maxValue = 1;

  const radarScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxValue as number])
        .range([r_0, 0]),
    [r_0, maxValue]
  );

  const reqRadar = async () => {
    const selectedCountry = nameToID[title];
    const response: any = await reqRadarData({ selectedCountry, year: 2019 });
    setData(response.data);
  };

  useEffect(() => {
    reqRadar();
  }, []);

  const generatePoint = ({ length, angle }: any) => {
    const point = {
      x: center.x + length * Math.sin(offset - angle),
      y: center.y + length * Math.cos(offset - angle),
    };
    return point;
  };

  const drawPath = (points: Array<any>) => {
    // draw points
    let pathD = "";
    if (points.length) {
      points.forEach((point, index) => {
        if (index == 0) {
          pathD += `M${point.x} ${point.y} `;
        } else {
          pathD += `L${point.x} ${point.y} `;
        }
      });
      pathD += "Z";
    }

    return pathD;
  };

  const drawLabels = (data: any, sides: number) => {
    const labels = [];
    for (let vertex = 0; vertex < sides; vertex++) {
      const angle = vertex * polyangle;
      const label = data[vertex]["axisname"];
      const point = generatePoint({ length: 0.9 * (size / 2), angle });

      labels.push({ ...point, label: label });
    }
    return labels;
  };

  return width && data ? (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <PolyGrid
        sides={sides}
        level={level}
        width={width}
        height={height}
        r={r}
        r_0={r_0}
        size={size}
        center={center}
        generatePoint={generatePoint}
        drawPath={drawPath}
      />
      <Axis
        scale={radarScale}
        position={[center.x, center.y - r_0]}
        direction={DirectionValue.LEFT}
        tickValues={tickValues}
      />
      <RadarArea
        data={data}
        generatePoint={generatePoint}
        drawPath={drawPath}
        radarScale={radarScale}
        sides={sides}
        r_0={r_0}
        color={color}
      />
      <g>
        {drawLabels(data, sides).map((item) => (
          <text
            key={item.label}
            style={{ textAnchor: "middle" }}
            x={item.x}
            y={item.y}
          >
            {item.label}
          </text>
        ))}
      </g>
    </svg>
  ) : null;
};

export default Radar;

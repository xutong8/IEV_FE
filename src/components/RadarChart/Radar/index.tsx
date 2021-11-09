import PolyGrid from "./PolyGrid";
import { scaleLinear } from "d3-scale";
import { useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import Axis, { DirectionValue } from "../../Axis";
import RadarArea from "./RadarArea";
import { nameToIDObj } from "@/constants/nameMapToID";
import { reqRadarData } from "@/services/api";
import rangeWithLen from "@/utils/rangeWithLen";
import { IStore } from "@/reducers";
import { useSelector } from "react-redux";

export interface IRadar {
  radarSide: number; // 用于控制svg绘制
  title: string;
  color: string | undefined;
  tooltipRef: any;
}

export interface IRadarItem {
  axisname: string;
  value: number;
}
// TODO: 实现数据Scale range 取整10 算法; 配色方案; tooltip接入; 接入全局的year
const Radar: React.FC<IRadar> = (props) => {
  const { radarSide, title, color, tooltipRef } = props;
  const [data, setData] = useState<Array<IRadarItem>>([]);
  const [maxValue, setMaxValue] = useState<number>(0);
  const level = 4;
  const sides = useMemo(() => data.length, [data]);
  const size = useMemo(() => radarSide - 16, [radarSide]); // 用于控制雷达图绘制
  const r = 0.7 * size;
  const r_0 = r / 2;
  const center = {
    x: size / 2 + 8,
    y: size / 2 + 8,
  };
  const offset = Math.PI;
  const polyangle = (Math.PI * 2) / sides;
  const nameToID = nameToIDObj;

  const { year } = useSelector(
    (state: IStore) => ({
      year: state.year,
    }),
    (prev, next) => isEqual(prev, next)
  );

  const tickValues = useMemo(() => {
    return rangeWithLen(1, maxValue, level + 1);
  }, [maxValue]);
  // const maxValue = 1;

  const radarScale = useMemo(
    () =>
      scaleLinear()
        .domain([1, maxValue as number])
        .range([0, r_0]),
    [r_0, maxValue]
  );

  const reqRadar = async () => {
    const selectedCountry = nameToID[title];
    const response: any = await reqRadarData({ selectedCountry, year: year });
    setData(response.data.data);

    setMaxValue(response.data.range);
  };

  useEffect(() => {
    reqRadar();
  }, [year, title, radarSide]);

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
        if (index === 0) {
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
      let angle = vertex * polyangle;

      const label = data[vertex]["axisname"];
      // 进行标签旋转
      if (angle != 0 && angle != Math.PI) {
        if (
          angle < Math.PI / 2 ||
          (angle > Math.PI && angle <= (Math.PI / 2) * 3)
        ) {
          angle -= Math.PI / 15;
        } else {
          angle += Math.PI / 15;
        }
      }
      const point = generatePoint({ length: 0.75 * (size / 2), angle });
      labels.push({ ...point, label: label, angle: angle });
    }
    return labels;
  };

  return radarSide > 0 && data ? (
    <svg
      width={radarSide}
      height={radarSide}
      viewBox={`0 0 ${radarSide} ${radarSide}`}
    >
      <PolyGrid
        sides={sides}
        level={level}
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
        attributes={{ fontSize: `${radarSide / 25}px` }}
      />
      <RadarArea
        data={data}
        generatePoint={generatePoint}
        drawPath={drawPath}
        radarScale={radarScale}
        sides={sides}
        r_0={r_0}
        color={color}
        tooltipRef={tooltipRef}
      />
      <g>
        {drawLabels(data, sides).map((item) => (
          <g key={item.label}>
            <text
              key={item.label}
              style={{
                textAnchor:
                  item.angle === 0 || item.angle === Math.PI
                    ? "middle"
                    : item.angle > Math.PI
                    ? "end"
                    : "start",
                dominantBaseline:
                  item.angle === 0
                    ? "inherit"
                    : item.angle === Math.PI
                    ? "hanging"
                    : "central",
                fontSize: `${radarSide / 25}px`,
              }}
              x={item.x}
              y={item.y}
            >
              {item.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  ) : null;
};

export default Radar;

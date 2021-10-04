import PolyGrid from "./PolyGrid";
import { scaleLinear } from "d3-scale";
import { useEffect, useMemo } from "react";
import { max } from "lodash";
import Axis, { DirectionValue } from "../../Axis";
import RadarArea from "./RadarArea";

export interface IRadar {
  svgWidth: number;
  svgHeight: number;
}

export interface IRadarData {
  [country: string]: ICountryTypesData;
}

export interface ICountryTypesData {
  [type: string]: number;
}

const data: IRadarData = {
  China: {
    Agriculture: 90,
    textile: 120,
    food: 30,
    tech: 140,
    chemistry: 30,
  },
  USA: {
    Agriculture: 50,
    textile: 80,
    food: 20,
    tech: 120,
    chemistry: 80,
  },
};
// TODO: 实现数据Scale range 取整10 算法; 配色方案; tooltip接入
const Radar: React.FC<IRadar> = (props) => {
  const { svgWidth, svgHeight } = props;
  const width = svgWidth;
  const height = svgHeight;
  // TODO: 通过输入数据的维度计算
  const sides = 5;
  const size = useMemo(() => Math.min(width, height), [width, height]);
  const r = 0.8 * size;
  const r_0 = r / 2;
  const center = {
    x: size / 2,
    y: size / 2,
  };
  const offset = Math.PI;
  // 抽离
  const polyangle = (Math.PI * 2) / sides;

  const maxValue: number | undefined = max(
    Object.keys(data)
      .map((key) => Object.keys(data[key]).map((type) => data[key][type]))
      ?.flat()
  );

  const radarScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxValue as number])
        .range([r_0, 0]),
    [r_0]
  );

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
    points.forEach((point, index) => {
      if (index == 0) {
        pathD += `M${point.x} ${point.y} `;
      } else {
        pathD += `L${point.x} ${point.y} `;
      }
    });
    pathD += "Z";

    return pathD;
  };

  const drawLabels = (data: any, sides: number) => {
    const labels = [];
    const types = Object.keys(data["China"]);
    for (let vertex = 0; vertex < sides; vertex++) {
      const angle = vertex * polyangle;
      const label = types[vertex];
      const point = generatePoint({ length: 0.9 * (size / 2), angle });

      labels.push({ ...point, label: label });
    }
    return labels;
  };

  return width ? (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <PolyGrid
        sides={5}
        level={4}
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
        tickValues={[0, 35, 70, 105, 140]}
      />
      <RadarArea
        data={data["China"]}
        generatePoint={generatePoint}
        drawPath={drawPath}
        radarScale={radarScale}
        size={size}
        r_0={r_0}
        attributes={{
          fill: "#d62728",
          fillOpacity: 0.3,
        }}
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

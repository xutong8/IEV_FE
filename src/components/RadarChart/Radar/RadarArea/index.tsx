import { keys } from "lodash";
import { useEffect, useRef, useState } from "react";

export interface IRadarArea {
  data: any;
  generatePoint: any;
  drawPath: any;
  radarScale: any;
  size: number;
  r_0: number;
  attributes: any;
}

const RadarArea: React.FC<IRadarArea> = (props) => {
  const { data, generatePoint, drawPath, radarScale, size, r_0, attributes } =
    props;
  const path = useRef();
  const circles: Array<any> = [];

  const onMouseEnter = () => {
    // tooltip
  };

  const onMouseLeave = () => {
    // tooltip
  };

  const drawData = (data: any, n: number) => {
    Object.keys(data).forEach((type: any, i: number) => {
      const len = r_0 - radarScale(data[type]);
      const theta = i * ((2 * Math.PI) / n);

      circles.push({
        ...generatePoint({ length: len, angle: theta }),
        value: data[type],
      });
    });
    console.log(circles);
    path.current = drawPath([...circles]);
  };

  drawData(data, 5);
  return (
    <g className="radar_area">
      {circles?.map((circle: any, index: number) => (
        <circle
          key={index}
          cx={circle.x}
          cy={circle.y}
          r={3}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ))}
      <path
        d={path.current}
        fill="none"
        stroke="black"
        strokeWidth={1}
        {...attributes}
      />
    </g>
  );
};

export default RadarArea;

import Tooltip from "@/components/Tooltip";
import Item from "antd/lib/list/Item";
import { useEffect, useRef, useState } from "react";
import styles from "./index.less";

export interface IRadarArea {
  data: any;
  generatePoint: any;
  drawPath: any;
  radarScale: any;
  sides: number;
  r_0: number;
  color: string | undefined;
  tooltipRef?: any;
  attributes?: any;
}

const RadarArea: React.FC<IRadarArea> = (props) => {
  const {
    data,
    generatePoint,
    drawPath,
    radarScale,
    sides,
    r_0,
    attributes,
    color,
    tooltipRef,
  } = props;
  const path = useRef();
  const circles: Array<any> = [];
  const onMouseEnter = (e: any, message: any) => {
    console.log("enter");
    // tooltip
    tooltipRef.current.onMouseMove(e, message);
  };

  const onMouseLeave = () => {
    // tooltip
    tooltipRef.current.onMouseLeave();
  };

  const drawData = (data: any, n: number) => {
    data.forEach((item: any, i: number) => {
      const len = r_0 - radarScale(item["value"]);
      const theta = i * ((2 * Math.PI) / n);
      circles.push({
        ...generatePoint({ length: len, angle: theta }),
        value: item["value"],
        name: item["axisname"],
      });
    });
    path.current = drawPath([...circles]);
  };

  drawData(data, sides);
  return (
    <g className="radar_area">
      {circles?.map((circle: any, index: number) => (
        <circle
          className={styles["radar_circle"]}
          key={index}
          cx={circle.x}
          cy={circle.y}
          fill={color}
          r={2}
          onMouseEnter={(e) =>
            onMouseEnter(e, { name: circle.name, value: circle.value })
          }
          onMouseLeave={onMouseLeave}
        />
      ))}
      <path
        className={styles["radar_item"]}
        stroke={color}
        fill={color}
        d={path.current}
        {...attributes}
      />
    </g>
  );
};

export default RadarArea;

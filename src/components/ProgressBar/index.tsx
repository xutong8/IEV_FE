import { scaleLinear } from "d3-scale";
import React, { useEffect, useState } from "react";
import Axis, { DirectionValue } from "../Axis";
import styles from "./index.less";
import { select } from "d3-selection";
import { pointer } from "d3";

export interface IProgressBarProps {
  width: number;
  height: number;
}

const ProgressBar: React.FC<IProgressBarProps> = (props) => {
  const { width, height } = props;

  const xScale = scaleLinear().domain([1995, 2019]).range([0, width]);

  const [lineX, setLineX] = useState<number>(width);

  const handleClick = () => {
    select(`.${styles.progressbar}`).on("click", (event: MouseEvent) => {
      const mouseX = pointer(event)[0];
      const newYear = Math.round(xScale.invert(mouseX));
      setLineX(xScale(newYear));
    });

    // return () => {
    //   select(`.${styles.progressbar}`).on("click", null);
    // };
  };

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <svg width={width} height={height} className={styles.progressbar}>
      <foreignObject width="100%" height="100%">
        <div
          style={{ width: lineX, height: 10, background: "red", opacity: 0.6 }}
        />
        <div
          style={{ width: lineX, height: 10, background: "blue", opacity: 0.6 }}
        />
        <div
          style={{
            width: lineX,
            height: 10,
            background: "yellow",
            opacity: 0.6,
          }}
        />
        <div
          style={{ width: lineX, height: 10, background: "pink", opacity: 0.6 }}
        />
      </foreignObject>
      <line
        className={styles.tooltip}
        x1={lineX}
        y1={0}
        x2={lineX}
        y2={40}
        strokeWidth={4}
      />
      <Axis
        direction={DirectionValue.BOTTOM}
        position={[0, 40]}
        scale={xScale}
      />
    </svg>
  );
};

export default ProgressBar;

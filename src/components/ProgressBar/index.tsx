import { scaleLinear } from "d3-scale";
import React, { useEffect, useState } from "react";
import Axis, { DirectionValue } from "../Axis";
import styles from "./index.less";
import { select } from "d3-selection";
import { pointer, easeLinear } from "d3";
import { useTransition } from "@/hooks/useTransition";
import cn from "classnames";
export interface IProgressBarProps {
  width: number;
  height: number;
}

const colors = ["red", "blue", "yellow", "pink", "purple", "orange"];

const ProgressBar: React.FC<IProgressBarProps> = (props) => {
  const { width, height } = props;

  const xScale = scaleLinear().domain([1995, 2019]).range([0, width]);

  const [lineX, setLineX] = useState<number>(width);

  const [lines, setLines] = useState<any>({
    x1: lineX,
    x2: lineX,
  });
  const [values, setValues] = useState<any>([
    {
      width: lineX,
    },
    {
      width: lineX,
    },
    {
      width: lineX,
    },
    {
      width: lineX,
    },
    {
      width: lineX,
    },
    {
      width: lineX,
    },
    {
      width: lineX,
    },
  ]);

  // TODO: 事件解除绑定
  const bindClick = () => {
    select(`.${styles.progressbar}`).on("click", (event: MouseEvent) => {
      const mouseX = pointer(event)[0];
      const newYear = Math.round(xScale.invert(mouseX));
      setLineX(xScale(newYear));
      const lineX = xScale(newYear);
      const newValues = values.map(() => ({ width: lineX }));
      setLines({
        x1: lineX,
        x2: lineX,
      });
      setValues(newValues);
    });
  };

  useEffect(() => {
    bindClick();
  }, []);

  const { attrState: barAttrState } = useTransition({
    className: "bar-transition",
    value: values,
    deps: [values],
    duration: 500,
    easingFunction: easeLinear,
  });

  const { attrState: lineAttrState } = useTransition({
    className: "line-transition",
    value: [lines],
    deps: [lines],
    duration: 500,
    easingFunction: easeLinear,
  });

  return (
    <svg width={width} height={height} className={styles.progressbar}>
      <foreignObject width="100%" height="100%">
        {(barAttrState as { width: number }[]).map((item, index) => {
          return (
            <div
              className="bar-transition"
              key={index}
              style={{
                width: item.width,
                height: 10,
                opacity: 0.6,
                background: colors[index],
              }}
            />
          );
        })}
      </foreignObject>
      <line
        className={cn({
          [styles.tooltip]: true,
          "line-transition": true,
        })}
        x1={lineAttrState.x1 as number}
        // x1={lineX}
        y1={0}
        x2={lineAttrState.x2 as number}
        // x2={lineX}
        y2={60}
        strokeWidth={4}
      />
      <Axis
        direction={DirectionValue.BOTTOM}
        position={[0, 60]}
        scale={xScale}
      />
    </svg>
  );
};

export default ProgressBar;

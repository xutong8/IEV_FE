import { scaleLinear } from "d3-scale";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Axis, { DirectionValue } from "../Axis";
import styles from "./index.less";
import { select } from "d3-selection";
import { pointer, easeLinear } from "d3";
import { useTransition } from "@/hooks/useTransition";
import cn from "classnames";
import { useSVGSize } from "@/hooks/useSVGSize";
export interface IProgressBarProps {
  width: number | string;
  height: number | string;
}

const colors = ["red", "blue", "yellow", "pink", "purple", "orange"];

const ProgressBar: React.FC<IProgressBarProps> = (props) => {
  const { width, height } = props;

  const axisHeight = 20;

  // svg ref
  const svgRef = useRef<SVGSVGElement>(null);

  // computed width and height
  const [computedWidth, computedHeight] = useSVGSize(svgRef);

  const xScale = scaleLinear().domain([1995, 2019]).range([0, computedWidth]);

  // 当前年份的x坐标
  const [lineX, setLineX] = useState<number>(0);

  useEffect(() => {
    setLineX(computedWidth);
  }, [computedWidth]);

  const lines = useMemo(
    () => ({
      x1: lineX,
      x2: lineX,
    }),
    [lineX]
  );

  const bars = useMemo(
    () => [
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
    ],
    [lineX]
  );

  // TODO: 事件解除绑定
  const bindClick = () => {
    select(`.${styles.progressbar}`).on("click", (event: MouseEvent) => {
      const mouseX = pointer(event)[0];
      const newYear = Math.round(xScale.invert(mouseX));
      setLineX(xScale(newYear));
    });
  };

  useEffect(() => {
    bindClick();
  }, [xScale.range()]);

  const { attrState: barAttrState } = useTransition({
    className: "bar-transition",
    value: bars,
    deps: [bars],
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
    <svg
      width={width}
      height={height}
      className={styles.progressbar}
      ref={svgRef}
    >
      <foreignObject width="100%" height="100%">
        {(barAttrState as { width: number }[]).map((item, index) => {
          return (
            <div
              className="bar-transition"
              key={index}
              style={{
                width: item.width,
                height: (computedHeight - axisHeight) / colors.length,
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
        y1={0}
        x2={lineAttrState.x2 as number}
        y2={computedHeight - axisHeight}
        strokeWidth={4}
      />
      <Axis
        direction={DirectionValue.BOTTOM}
        position={[0, computedHeight - axisHeight]}
        scale={xScale}
      />
    </svg>
  );
};

export default ProgressBar;

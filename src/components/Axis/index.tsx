import { useEffect, useMemo, useRef, SVGAttributes } from "react";
import { axisTop, axisBottom, axisLeft, axisRight, AxisScale } from "d3-axis";
import { select } from "d3-selection";

export enum DirectionValue {
  TOP = "top",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
}

export interface IAxisProps {
  direction?: DirectionValue;
  position?: [number, number];
  scale: AxisScale<number>;
  ticks?: number;
  tickValues?: number[];
  tickFormat?: () => void;
  attributes?: SVGAttributes<SVGGElement>;
}

const Axis: React.FC<IAxisProps> = (props) => {
  const gAxisRef = useRef<SVGGElement>(null);

  const {
    direction = DirectionValue.TOP,
    position = [0, 0],
    scale,
    tickValues = null,
    ticks = 10,
    tickFormat,
    attributes = {},
  } = props;

  const axisDirection = useMemo(
    () => (direction: DirectionValue) => {
      switch (direction) {
        case DirectionValue.TOP:
          return axisTop(scale)
            .ticks(ticks)
            .tickValues(tickValues as any);
        case DirectionValue.BOTTOM:
          return axisBottom(scale)
            .ticks(ticks)
            .tickValues(tickValues as any);
        case DirectionValue.LEFT:
          return axisLeft(scale)
            .ticks(ticks)
            .tickValues(tickValues as any);
        case DirectionValue.RIGHT:
          return axisRight(scale)
            .ticks(ticks)
            .tickValues(tickValues as any);
        default:
          return axisTop(scale)
            .ticks(ticks)
            .tickValues(tickValues as any);
      }
    },
    [scale, tickValues, ticks]
  );

  // TODO: Selection ts类型
  const axis = useMemo(
    () => (g: any) => {
      g.call(axisDirection(direction));
    },
    [direction, axisDirection]
  );

  useEffect(() => {
    select(gAxisRef.current).call(axis);
  }, [axis, scale.domain()]);

  return (
    <g
      ref={gAxisRef}
      transform={`translate(${position[0]}, ${position[1]})`}
      {...attributes}
    />
  );
};

export default Axis;

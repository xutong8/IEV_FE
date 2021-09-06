import { useEffect, useMemo, useRef } from "react";
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
}

const Axis: React.FC<IAxisProps> = (props) => {
  const gAxisRef = useRef<SVGGElement>(null);

  const { direction = DirectionValue.TOP, position = [0, 0], scale } = props;

  const axisDirection = useMemo(
    () => (direction: DirectionValue) => {
      switch (direction) {
        case DirectionValue.TOP:
          return axisTop(scale);
        case DirectionValue.BOTTOM:
          return axisBottom(scale);
        case DirectionValue.LEFT:
          return axisLeft(scale);
        case DirectionValue.RIGHT:
          return axisRight(scale);
        default:
          return axisTop(scale);
      }
    },
    [scale]
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
    <g ref={gAxisRef} transform={`translate(${position[0]}, ${position[1]})`} />
  );
};

export default Axis;

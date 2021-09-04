import { IHandlers, useHighlight } from "@/hooks/useHighlight";
import React, { SVGAttributes } from "react";

export interface IForceNodeProps {
  r: number;
  cx: number;
  cy: number;
  id: string;
  className: string;
  handlers: IHandlers;
  attributes?: SVGAttributes<SVGCircleElement>;
}

const ForceNode: React.FC<IForceNodeProps> = (props) => {
  const { r, attributes = {}, cx, cy, className, id, handlers } = props;

  useHighlight(id, true, handlers);

  return (
    <circle
      id={id}
      className={className}
      r={r}
      cx={cx}
      cy={cy}
      {...attributes}
    />
  );
};

export default ForceNode;

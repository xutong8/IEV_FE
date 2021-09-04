import { useHighlight, IHandlers } from "@/hooks/useHighlight";
import React, { SVGAttributes } from "react";

export interface IForceLinkProps {
  attributes?: SVGAttributes<SVGLineElement>;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  className: string;
  id: string;
  handlers: IHandlers;
}

const ForceLink: React.FC<IForceLinkProps> = (props) => {
  const { attributes = {}, x1, y1, x2, y2, className, id, handlers } = props;

  useHighlight(id, true, handlers);

  return (
    <line
      id={id}
      className={className}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      {...attributes}
    />
  );
};

export default ForceLink;

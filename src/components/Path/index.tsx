import React, { SVGAttributes } from "react";
import { pointer } from "d3";

export interface IPathProps {
  attributes?: SVGAttributes<SVGPathElement>;
  id: string;
  onMouseEnter: (hoverName: string) => void;
  onMouseLeave: () => void;
  onMouseMove: (
    hoverName: string,
    coordinates: Array<number>,
    event: any
  ) => void;
}

const Path: React.FC<IPathProps> = (props) => {
  const {
    id,
    attributes = {},
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  } = props;

  return (
    <path
      id={id}
      className="stackArea"
      style={{ transition: "all .5s ease" }}
      {...attributes}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseMove={(e: any) => onMouseMove(id, pointer(e), e)}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default Path;

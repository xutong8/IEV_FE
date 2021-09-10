import React, { SVGAttributes } from "react";

export interface IPathProps {
  attributes?: SVGAttributes<SVGPathElement>;
  id: string;
  onMouseEnter: (e: any) => void;
  onMouseLeave: (e: any) => void;
  // onMouseLeave: function;
}

const Path: React.FC<IPathProps> = (props) => {
  const { id, attributes = {}, onMouseEnter, onMouseLeave } = props;

  return (
    <path
      id={id}
      {...attributes}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default Path;

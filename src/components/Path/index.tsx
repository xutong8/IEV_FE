import React, { SVGAttributes } from "react";

export interface IPathProps {
  attributes?: SVGAttributes<SVGPathElement>;
  id: string;
  onMouseEnter: (hoverName: string) => void;
  onMouseLeave: () => void;
  // onMouseLeave: function;
}

const Path: React.FC<IPathProps> = (props) => {
  const { id, attributes = {}, onMouseEnter, onMouseLeave } = props;

  return (
    <path
      id={id}
      {...attributes}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default Path;

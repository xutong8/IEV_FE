import React, { SVGAttributes } from "react";

export interface IPathProps {
  attributes?: SVGAttributes<SVGPathElement>;
  id: string;
}

const Path: React.FC<IPathProps> = (props) => {
  const { id, attributes = {} } = props;

  return <path id={id} {...attributes} />;
};

export default Path;

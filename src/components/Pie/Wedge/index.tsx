import { useState } from "react";

export interface IWedge {
  d: string | null;
  id: string;
  fill: string;
  onMouseMove: any;
  onMouseLeave: any;
}

const Wedge: React.FC<IWedge> = (props) => {
  const { d, fill, onMouseMove, onMouseLeave, id } = props;
  const [opacity, setOpacity] = useState<string>("0.7");
  return d ? (
    <path
      id={id}
      fill={fill}
      d={d}
      opacity={opacity}
      onMouseEnter={() => {
        setOpacity("1");
      }}
      onMouseMove={(e) => onMouseMove(e)}
      onMouseLeave={() => {
        onMouseLeave();
        setOpacity("0.7");
      }}
    />
  ) : null;
};

export default Wedge;

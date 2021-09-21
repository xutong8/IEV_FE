export interface IWedge {
  d: string | null;
  id: string;
  fill: string;
  tipMessage: any;
  onMouseMove: any;
  onMouseLeave: any;
}

const Wedge: React.FC<IWedge> = (props) => {
  const { d, fill, onMouseMove, onMouseLeave, tipMessage, id } = props;
  return d ? (
    <path
      id={id}
      fill={fill}
      d={d}
      onMouseMove={(e) => onMouseMove(e, tipMessage)}
      onMouseLeave={onMouseLeave}
    />
  ) : null;
};

export default Wedge;

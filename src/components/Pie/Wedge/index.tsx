export interface IWedge {
  d: string | null;
  fill: string;
  tipMessage: any;
  onMouseMove: any;
  onMouseLeave: any;
}

const Wedge: React.FC<IWedge> = (props) => {
  const { d, fill, onMouseMove, onMouseLeave, tipMessage } = props;
  return d ? (
    <path
      fill={fill}
      d={d}
      onMouseMove={(e) => onMouseMove(e, tipMessage)}
      onMouseLeave={onMouseLeave}
    />
  ) : null;
};

export default Wedge;

export interface IWedge {
  d: string | null;
  fill: string;
  onMouseMove: any;
  onMouseLeave: any;
}

const Wedge: React.FC<IWedge> = (props) => {
  const { d, fill, onMouseMove, onMouseLeave } = props;
  return d ? (
    <path
      fill={fill}
      d={d}
      onMouseMove={(e) => onMouseMove(e)}
      onMouseLeave={onMouseLeave}
    />
  ) : null;
};

export default Wedge;

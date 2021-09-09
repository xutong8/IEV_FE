export interface IWedge {
  d: string | null;
  fill: string;
}

const Wedge: React.FC<IWedge> = (props) => {
  const { d, fill } = props;
  return d ? <path fill={fill} d={d} /> : null;
};

export default Wedge;

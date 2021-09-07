export interface IWedge {
  d: string;
  fill: string;
}

const Wedge: React.FC<IWedge> = (props) => {
  const { d, fill } = props;
  return <path fill={fill} d={d} />;
};

export default Wedge;

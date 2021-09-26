import PolyGrid from "./PolyGrid";

export interface IRadar {
  width: number;
  height: number;
}

const Radar: React.FC<IRadar> = (props) => {
  const { width, height } = props;
  return (
    <svg width={width} height={height}>
      <PolyGrid sides={5} level={4} width={width} height={height} />
    </svg>
  );
};

export default Radar;

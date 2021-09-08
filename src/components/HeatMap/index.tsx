import React from "react";

export interface IHeatMapProps {
  width: number;
  height: number;
}

const HeatMap: React.FC<IHeatMapProps> = (props) => {
  const { width, height } = props;

  return <svg width={width} height={height} />;
};

export default HeatMap;

import React, { useMemo } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { IRow } from "@/types/heatmap";
export interface IHeatMapProps {
  width: number;
  height: number;
  dataSource: IRow[];
}

const HeatMap: React.FC<IHeatMapProps> = (props) => {
  const { width, height, dataSource } = props;

  const maxValue = useMemo(
    () =>
      Math.max(
        ...dataSource.map((item) =>
          Math.max(...item.explist.map((exp) => exp.expvalue))
        )
      ),
    [dataSource]
  );

  // color scale
  const colorScale = scaleLinear<string>()
    .domain([0, maxValue])
    .range(["gray", "#A3320B"]);

  const countryNames = useMemo(
    () => dataSource.map((item) => item.countryName),
    [dataSource]
  );

  // x scale
  const xScale = scaleBand().domain(countryNames).range([0, width]);

  // y scale
  const yScale = scaleBand().domain(countryNames).range([0, height]);

  return (
    <svg width={width} height={height} transform="rotate(45)">
      {dataSource.map((row) => {
        return (
          <g key={row.countryName}>
            {row.explist.map((item) => {
              return (
                <rect
                  id={item.countryName}
                  key={item.countryName}
                  x={xScale(item.countryName)}
                  y={yScale(row.countryName)}
                  fill={colorScale(item.expvalue)}
                  width={width / countryNames.length}
                  height={height / countryNames.length}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default HeatMap;

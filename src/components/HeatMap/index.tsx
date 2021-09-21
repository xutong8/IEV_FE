import React, { useMemo } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { IRow } from "@/types/heatmap";
export interface IHeatMapProps {
  width: number;
  height: number;
  dataSource: IRow[];
  className?: string;
}

const HeatMap: React.FC<IHeatMapProps> = (props) => {
  const { width, height, dataSource, className = "" } = props;

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
    .range(["#f8d06b", "#eb7f3e"]);

  const countryNames = useMemo(
    () => dataSource.map((item) => item.countryName),
    [dataSource]
  );

  // x scale
  const xScale = scaleBand().domain(countryNames).range([0, width]);

  // y scale
  const yScale = scaleBand().domain(countryNames).range([0, height]);

  return (
    <svg
      width={width}
      height={height}
      transform="rotate(45)"
      className={className}
    >
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
                  fill={
                    row.countryName === item.countryName
                      ? "#ffffff"
                      : colorScale(item.expvalue)
                  }
                  strokeWidth={1}
                  stroke="#d3d3d2"
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

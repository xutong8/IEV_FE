import { processHeatMapData } from "@/utils/processHeatMapData";
import React, { useState } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
export interface IHeatMapProps {
  width: number;
  height: number;
  countryNames: string[];
  year: string;
  category: string;
}

const HeatMap: React.FC<IHeatMapProps> = (props) => {
  const { width, height, countryNames, year, category } = props;

  const { dataSource, maxValue } = processHeatMapData(
    countryNames,
    year,
    category
  );

  console.log("dataSource: ", dataSource);
  console.log("max: ", maxValue);

  // color scale
  const colorScale = scaleLinear<string>()
    .domain([0, maxValue])
    .range(["gray", "#A3320B"]);

  // x scale
  const xScale = scaleBand().domain(countryNames).range([0, width]);

  // y scale
  const yScale = scaleBand().domain(countryNames).range([0, height]);

  return (
    <svg width={width} height={height} transform="rotate(45)">
      {dataSource.map((row) => {
        return (
          <g key={row.name}>
            {row.explist.map((item) => {
              return (
                <rect
                  id={item.name}
                  key={item.name}
                  x={xScale(item.name)}
                  y={yScale(row.name)}
                  fill={colorScale(item.value)}
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

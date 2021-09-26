import React, { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { IRow } from "@/types/heatmap";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";
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

  // countryList selector
  const countryList = useSelector(
    (state: IStore) => state.countryList,
    (prev, next) => isEqual(prev, next)
  );

  // 当前hover的countryName
  // const [countryName, setCountryName] = useState<string>("");
  const [currentRowIdx, setCurrentRowIdx] = useState<number>(-1);
  const [currentColumnIdx, setCurrentColumnIdx] = useState<number>(-1);

  return (
    <svg
      width={width}
      height={height}
      transform="rotate(45)"
      className={className}
    >
      <defs>
        <filter height="200%" width="200%" x="-50%" y="-50%" id="f1">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>
      {dataSource.map((row, rowIdx) => {
        return (
          <g key={row.countryName}>
            {row.explist.map((item, columnIdx) => {
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
                  fillOpacity={
                    countryList.length === 0 ||
                    countryList.find(
                      (country) =>
                        country.name === item.countryName ||
                        country.name === row.countryName
                    )
                      ? 1
                      : 0.3
                  }
                  strokeWidth={1}
                  stroke="#d3d3d2"
                  width={width / countryNames.length}
                  height={height / countryNames.length}
                  onMouseEnter={() => {
                    setCurrentRowIdx(rowIdx);
                    setCurrentColumnIdx(columnIdx);
                  }}
                  onMouseLeave={() => {
                    setCurrentRowIdx(-1);
                    setCurrentColumnIdx(-1);
                  }}
                  filter={
                    (currentRowIdx === -1 && currentColumnIdx === -1) ||
                    rowIdx === currentRowIdx ||
                    columnIdx === currentColumnIdx
                      ? undefined
                      : "url(#f1)"
                  }
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

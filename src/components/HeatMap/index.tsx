import React, { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { IItem, IRow } from "@/types/heatmap";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";
export interface IHeatMapProps {
  width: number;
  height: number;
  dataSource: IRow[];
  className?: string;
  maxValue: number;
}

const HeatMap: React.FC<IHeatMapProps> = (props) => {
  const { width, height, dataSource, className = "", maxValue } = props;

  // color scale
  const colorScale = scaleLinear<number>()
    .domain([0, maxValue])
    .range([0.3, 1]);

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

  // 高亮边
  const highlightLine = (row: IRow, item: IItem) => {
    const inputLines = document.getElementsByClassName(
      `line_${row.countryName}`
    )[0];
    inputLines.setAttribute("stroke-opacity", "1");

    const outputLines = document.getElementsByClassName(
      `line_${item.countryName}`
    )[1];
    outputLines.setAttribute("stroke-opacity", "1");
  };

  // 取消高亮边
  const unhighlightLine = (row: IRow, item: IItem) => {
    const inputLines = document.getElementsByClassName(
      `line_${row.countryName}`
    )[0];
    inputLines.setAttribute("stroke-opacity", "0.4");

    const outputLines = document.getElementsByClassName(
      `line_${item.countryName}`
    )[1];
    outputLines.setAttribute("stroke-opacity", "0.4");
  };

  // 高亮文本
  const highlightText = (row: IRow, item: IItem) => {
    const inputText = document.getElementsByClassName(
      `text_${row.countryName}`
    )[1];
    inputText.setAttribute("fill-opacity", "1");

    const outputText = document.getElementsByClassName(
      `text_${item.countryName}`
    )[0];
    outputText.setAttribute("fill-opacity", "1");
  };

  // 取消高亮文本
  const unhighlightText = (row: IRow, item: IItem) => {
    const inputText = document.getElementsByClassName(
      `text_${row.countryName}`
    )[1];
    inputText.setAttribute("fill-opacity", "0.4");

    const outputText = document.getElementsByClassName(
      `text_${item.countryName}`
    )[0];
    outputText.setAttribute("fill-opacity", "0.4");
  };

  // 高亮矩形
  const highlightRect = (row: IRow, item: IItem) => {
    const inputRect = document.getElementsByClassName(
      `${row.countryName}bar`
    )[0] as HTMLDivElement;
    inputRect.style.opacity = "1";

    const outputRect = document.getElementsByClassName(
      `${item.countryName}bar`
    )[1] as HTMLDivElement;
    outputRect.style.opacity = "1";
  };

  const handleMouseEnter = (
    rowIdx: number,
    columnIdx: number,
    row: IRow,
    item: IItem
  ) => {
    // 高亮边
    highlightLine(row, item);
    // 高亮文本
    highlightText(row, item);
    // 高亮矩形
    highlightRect(row, item);
    setCurrentRowIdx(rowIdx);
    setCurrentColumnIdx(columnIdx);
  };

  // 取消高亮矩形
  const unhighlightRect = (row: IRow, item: IItem) => {
    const inputRect = document.getElementsByClassName(
      `${row.countryName}bar`
    )[0] as HTMLDivElement;
    inputRect.style.opacity = "0.4";

    const outputRect = document.getElementsByClassName(
      `${item.countryName}bar`
    )[1] as HTMLDivElement;
    outputRect.style.opacity = "0.4";
  };

  const handleMouseLeave = (row: IRow, item: IItem) => {
    // 取消高亮边
    unhighlightLine(row, item);
    // 取消高亮文本
    unhighlightText(row, item);
    // 取消高亮矩形
    unhighlightRect(row, item);
    setCurrentRowIdx(-1);
    setCurrentColumnIdx(-1);
  };

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
                  key={item.countryName}
                  id={item.countryName}
                  x={xScale(item.countryName)}
                  y={yScale(row.countryName)}
                  fill={
                    row.countryName === item.countryName ? "#ffffff" : "#2781E5"
                  }
                  fillOpacity={
                    countryList.length === 0
                      ? colorScale(item.expvalue)
                      : countryList.find(
                          (country) =>
                            country.name === item.countryName ||
                            country.name === row.countryName
                        )
                      ? colorScale(item.expvalue)
                      : // 0.8 * (1 - colorScale(item.expvalue))
                        colorScale(item.expvalue) * 0.25
                  }
                  strokeWidth={1}
                  stroke="#ffffff"
                  width={width / countryNames.length}
                  height={height / countryNames.length}
                  onMouseEnter={() =>
                    handleMouseEnter(rowIdx, columnIdx, row, item)
                  }
                  onMouseLeave={() => handleMouseLeave(row, item)}
                  filter={
                    (currentRowIdx === -1 && currentColumnIdx === -1) ||
                    rowIdx === currentRowIdx ||
                    columnIdx === currentColumnIdx
                      ? undefined
                      : // : countryList.length === 0 ||
                        //   countryList.find(
                        //     (country) =>
                        //       country.name === item.countryName ||
                        //       country.name === row.countryName
                        //   )
                        // ? undefined
                        "url(#f1)"
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

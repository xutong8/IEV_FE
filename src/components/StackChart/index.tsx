import { scaleLinear } from "d3-scale";
import { area, stack } from "d3-shape";
import Axis, { DirectionValue } from "../Axis";
import {
  areaDataRaw,
  IStackAreaData,
  filterCountry,
} from "@/utils/processAreaData";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Path from "../Path";
import Legend from "../Legend";
import { brushX } from "d3-brush";
import { select } from "d3-selection";
import { processTicks, processTicksByMax } from "@/utils/processTicks";
import { colorMap } from "@/utils/generateCountryColor";
import dataSource from "@/data/nameToDigit2.json";
import {
  namesToColumns,
  namesToNations,
  nationsToNames,
} from "@/utils/namesToColumns";
import styles from "./index.less";
import ceil from "lodash/ceil";
import Tooltip from "../Tooltip";

export interface IStackChartProps {
  width: number;
  height: number;
}
const StackChart: React.FC<IStackChartProps> = (props) => {
  const { width, height } = props;

  // svg ref
  const svgRef = useRef<SVGSVGElement>(null);
  // tooltip ref
  const toolTipRef = useRef<any>();

  const legendHeight = height * 0.25;

  // brush在Y轴上的偏移
  const BrushYOffset = 25;

  // (0, 0)点的位置
  const zeroPosition = useMemo(() => [40, height - 70], [height]);
  const [areaData, setAreaData] = useState<IStackAreaData[]>(areaDataRaw);
  const [filterList, setFilterList] = useState<Array<string>>([]);
  const [hoverCountry, setHoverCountry] = useState<string>("");

  // 映射获得年数组
  const years = useMemo(() => areaData.map((item) => item.date), [areaData]);
  // 获取最小年
  const minYear = useMemo(() => Math.min(...years), [years]);
  // 获取最大年
  const maxYear = useMemo(() => Math.max(...years), [years]);

  // 使用stack函数计算得到堆叠后的数据
  const series = useMemo(
    () => stack().keys((areaData as any).columns.slice(1))(areaData),
    [areaData]
  );

  // x轴的scale
  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([minYear, maxYear])
        .range([zeroPosition[0], width - 20]),
    [minYear, maxYear, zeroPosition, width]
  );

  // brush的scale
  const brushScale = useMemo(
    () =>
      scaleLinear()
        .domain([minYear, maxYear])
        .range([zeroPosition[0], width - 20]),
    [minYear, maxYear, zeroPosition, width]
  );

  // brush ref
  const brushRef = useRef<SVGGElement>(null);

  // 强制组件更新
  const [, forceUpdate] = useState<number>(0);
  // X轴的刻度数量为7个
  const X_TICKS = 6;
  // 处理ticks
  const yearTicks = processTicks<number>(years, X_TICKS);

  // brush的处理函数
  const brushed = useMemo(
    () => (event: any) => {
      const selection = event.selection || brushScale.range();
      xScale.domain(
        selection.map(
          (s: number) => Math.round(brushScale.invert(s)),
          brushScale
        )
      );
      forceUpdate((prev) => prev + 1);
    },
    [brushScale, xScale]
  );

  // 创建一个brush
  const brush = useMemo(
    () =>
      brushX()
        .extent([
          [zeroPosition[0], -20],
          [width - 20, 0],
        ])
        .on("brush end", brushed),
    [width, zeroPosition, brushed]
  );

  useEffect(() => {
    if (width !== 0) {
      select(brushRef.current as SVGGElement)
        .call(brush)
        .call(brush.move, xScale.range());
    }
  }, [width, brush, xScale]);

  // 最后一行的数据
  const lastItems = series[series.length - 1].map((item) => item[1]);

  // y的最大值
  const maxY = useMemo(() => ceil(Math.max(...lastItems)), [lastItems]);

  // y轴的刻度数量
  const Y_TICKS = 8;

  // 处理ticks
  const yTicks = processTicksByMax(maxY, Y_TICKS);

  // y轴的scale
  const yScale = scaleLinear()
    .domain([0, maxY])
    .range([zeroPosition[1], legendHeight + 30]);

  const areaFunc = area()
    .x((d: any) => xScale(Number(d.data.date)))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const onMouseEnter = useCallback(
    (hoverName) => {
      setHoverCountry(hoverName);
    },
    [xScale, areaData]
  );

  const onMouseMove = useCallback((hoverName, coordinates, e) => {
    const year = Math.round(xScale.invert(coordinates[0]));
    const value = areaData[year - 1995][hoverName].toFixed(3);
    console.log(year, value);
    toolTipRef.current.onMouseMove(e, { year, country: hoverName, value });
    // const value =
  }, []);

  const onLegendMouseEnter = (hoverName: string) => {
    setHoverCountry(namesToColumns.get(nationsToNames.get(hoverName)));
  };

  const onMouseLeave = useCallback(() => {
    console.log("leave");
    setHoverCountry("");
    toolTipRef.current.onMouseLeave();
  }, []);

  const onClick = useCallback(
    (digit2: string, state: boolean) => {
      // 更新过滤列表
      if (state) {
        setAreaData(
          filterCountry([
            ...filterList,
            namesToColumns.get(nationsToNames.get(digit2)),
          ])
        );
        setFilterList((filterList) => [
          ...filterList,
          namesToColumns.get(nationsToNames.get(digit2)),
        ]);
      } else {
        filterList.splice(
          filterList.indexOf(namesToColumns.get(nationsToNames.get(digit2))),
          1
        );
        setAreaData(filterCountry([...filterList]));
        setFilterList([...filterList]);
      }
    },
    [filterList]
  );

  return (
    <>
      <Tooltip ref={toolTipRef}>
        {({ year, country, value }: any) =>
          `<div>${year} ${country} </div><div>value: ${value}</div>`
        }
      </Tooltip>
      <svg width={width} height={height} ref={svgRef}>
        <foreignObject width="100%" height={legendHeight}>
          <div className={styles.legends}>
            <Legend
              orient="row"
              data={dataSource.results.map((item) =>
                namesToNations.get(item.name)
              )}
              color={(label: string) => {
                const item = dataSource.results.find(
                  (item) => item.name === nationsToNames.get(label)
                );
                return colorMap.get(item?.iso_2digit_alpha ?? "") ?? "";
              }}
              onClick={onClick}
              onMouseEnter={onLegendMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          </div>
        </foreignObject>
        <defs>
          <clipPath id="clip-path">
            <rect
              x={zeroPosition[0]}
              y={legendHeight}
              width={
                width - 20 - zeroPosition[0] < 0
                  ? 0
                  : width - 20 - zeroPosition[0]
              }
              height={
                zeroPosition[1] - legendHeight < 0
                  ? 0
                  : zeroPosition[1] - legendHeight
              }
            />
          </clipPath>
          <clipPath id="clip-axis">
            <rect
              x={zeroPosition[0] - 10}
              y={zeroPosition[1]}
              width={
                width - 20 - zeroPosition[0] + 25 < 0
                  ? 0
                  : width - 20 - zeroPosition[0] + 25
              }
              height={20}
            />
          </clipPath>
        </defs>
        <g>
          <g clipPath="url(#clip-axis)">
            <Axis
              scale={xScale}
              position={[0, zeroPosition[1]]}
              direction={DirectionValue.BOTTOM}
              tickValues={yearTicks}
              ticks={X_TICKS}
            />
          </g>
          <Axis
            scale={yScale}
            position={[zeroPosition[0], 0]}
            direction={DirectionValue.LEFT}
            ticks={Y_TICKS}
            tickValues={yTicks}
            tickFormat={(tick) => Math.round(tick / 100000)}
          />
          <text x={zeroPosition[0] - 30} y={legendHeight - 12}>
            单位：十万
          </text>
          <g clipPath="url(#clip-path)">
            {series.map((item: any, index: number) => {
              return (
                <Path
                  id={item.key as string}
                  key={index}
                  attributes={{
                    fill:
                      hoverCountry && item.key === hoverCountry
                        ? "#8fce74"
                        : colorMap.get(item.key),
                    d: areaFunc(item) as string,
                  }}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                />
              );
            })}
          </g>
        </g>
        <g transform={`translate(0, ${zeroPosition[1] + BrushYOffset + 20})`}>
          <Axis
            scale={brushScale}
            position={[0, 0]}
            direction={DirectionValue.BOTTOM}
            tickValues={yearTicks}
            ticks={X_TICKS}
          />
          <g ref={brushRef} />
        </g>
      </svg>
    </>
  );
};

export default StackChart;

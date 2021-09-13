import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeAccent } from "d3";
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
import styles from "./index.less";
import { useSVGSize } from "@/hooks/useSVGSize";
import { processTicks } from "@/utils/processTicks";
import { colorMap } from "@/utils/generateCountryColor";

export interface IStackChartProps {
  width: number | string;
  height: number | string;
}
const StackChart: React.FC<IStackChartProps> = (props) => {
  const { width, height } = props;

  // svg ref
  const svgRef = useRef<SVGSVGElement>(null);

  const [computedWidth, computedHeight] = useSVGSize(svgRef);

  // brush在Y轴上的偏移
  const BrushYOffset = 20;

  // (0, 0)点的位置
  const zeroPosition = useMemo(
    () => [40, computedHeight - 80],
    [computedHeight]
  );

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
        .range([zeroPosition[0], computedWidth - 20]),
    [minYear, maxYear, zeroPosition, computedWidth]
  );

  // brush的scale
  const brushScale = useMemo(
    () =>
      scaleLinear()
        .domain([minYear, maxYear])
        .range([zeroPosition[0], computedWidth - 20]),
    [minYear, maxYear, zeroPosition, computedWidth]
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
          [zeroPosition[0], 0],
          [computedWidth - 20, 40],
        ])
        .on("brush end", brushed),
    [computedWidth, zeroPosition, brushed]
  );

  useEffect(() => {
    if (computedWidth !== 0) {
      select(brushRef.current as SVGGElement)
        .call(brush)
        .call(brush.move, xScale.range());
    }
  }, [computedWidth]);

  // 最后一行的数据
  const lastItems = series[series.length - 1].map((item) => item[1]);

  // y的最大值
  const maxY = useMemo(() => Math.max(...lastItems), [lastItems]);

  // y轴的scale
  const yScale = scaleLinear().domain([0, maxY]).range([zeroPosition[1], 40]);

  const areaFunc = area()
    .x((d: any) => xScale(Number(d.data.date)))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const onMouseEnter = useCallback((hoverName) => {
    setHoverCountry(hoverName);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoverCountry("");
  }, []);

  const onClick = useCallback(
    (digit2: string, state: boolean) => {
      // 更新过滤列表
      if (state) {
        setAreaData(filterCountry([...filterList, digit2]));
        setFilterList((filterList) => [...filterList, digit2]);
      } else {
        filterList.splice(filterList.indexOf(digit2), 1);
        setAreaData(filterCountry([...filterList]));
        setFilterList([...filterList]);
      }
    },
    [filterList]
  );
  return (
    <svg width={width} height={height} ref={svgRef}>
      <defs>
        <clipPath id="clip-path">
          <rect
            x={zeroPosition[0]}
            y={36}
            width={
              computedWidth - 20 - zeroPosition[0] < 0
                ? 0
                : computedWidth - 20 - zeroPosition[0]
            }
            // 56为Legend的高度
            height={zeroPosition[1] - 36 < 0 ? 0 : zeroPosition[1] - 36}
          />
        </clipPath>
        {/* <clipPath id="clip-axis">
          <rect
            x={zeroPosition[0] - 10}
            y={126}
            width={
              computedWidth - zeroPosition[0] + 3 < 0
                ? 0
                : computedWidth - zeroPosition[0] + 3
            }
            height={20}
          />
        </clipPath> */}
      </defs>
      <g>
        <Axis
          scale={xScale}
          position={[0, zeroPosition[1]]}
          direction={DirectionValue.BOTTOM}
          tickValues={yearTicks}
          ticks={X_TICKS}
        />
        {/* <g clipPath="url(#clip-axis)">
          <Axis
            scale={xScale}
            position={[0, zeroPosition[1]]}
            direction={DirectionValue.BOTTOM}
            tickValues={yearTicks}
            ticks={X_TICKS}
          />
        </g> */}
        <Axis
          scale={yScale}
          position={[zeroPosition[0], 0]}
          direction={DirectionValue.LEFT}
        />
        <g clipPath="url(#clip-path)">
          {series.map((item: any, index: number) => {
            // console.log(item)
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
              />
            );
          })}
        </g>
      </g>
      <g transform={`translate(0, ${zeroPosition[1] + BrushYOffset})`}>
        <Axis
          scale={brushScale}
          position={[0, 41]}
          direction={DirectionValue.BOTTOM}
          tickValues={yearTicks}
          ticks={X_TICKS}
        />
        <g ref={brushRef} />
      </g>
    </svg>
  );
};

export default StackChart;

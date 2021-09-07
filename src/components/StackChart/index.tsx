import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeCategory10, schemeAccent } from "d3";
import { area, stack } from "d3-shape";
import Axis, { DirectionValue } from "../Axis";
import { areaData } from "@/utils/processAreaData";
import { useEffect, useMemo, useRef, useState } from "react";
import Path from "../Path";
import Legend from "../Legend";
import { brushX } from "d3-brush";
import { select } from "d3-selection";

export interface IStackChartProps {
  width: number;
  height: number;
}
const StackChart: React.FC<IStackChartProps> = (props) => {
  const { width, height } = props;

  const zeroPosition = useMemo(() => [100, height - 120], [height]);

  // 映射获得年数组
  const years = useMemo(() => areaData.map((item) => item.date), []);
  // 获取最小年
  const minYear = useMemo(() => Math.min(...years), [years]);
  // 获取最大年
  const maxYear = useMemo(() => Math.max(...years), [years]);

  // 使用stack函数计算得到堆叠后的数据
  const series = useMemo(
    () => stack().keys((areaData as any).columns.slice(1))(areaData),
    []
  );

  // TODO: 修改domain
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

  // brush的处理函数
  const brushed = useMemo(
    () => (event: any) => {
      const selection = event.selection || brushScale.range();
      xScale.domain(selection.map(brushScale.invert, brushScale));
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
          [width - 20, 40],
        ])
        .on("brush end", brushed),
    [width, zeroPosition, brushed]
  );

  useEffect(() => {
    select(brushRef.current as SVGGElement)
      .call(brush)
      .call(brush.move, xScale.range());
  }, []);

  // 最后一行的数据
  const lastItems = series[series.length - 1].map((item) => item[1]);

  // y的最大值
  const maxY = useMemo(() => Math.max(...lastItems), [lastItems]);

  // y轴的scale
  const yScale = scaleLinear().domain([0, maxY]).range([zeroPosition[1], 60]);

  const areaFunc = area()
    .x((d: any) => xScale(Number(d.data.date)))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const colorScale = scaleOrdinal()
    .domain((areaData as any).columns.slice(1))
    .range(schemeCategory10);

  return (
    <svg width={width} height={height}>
      <defs>
        <clipPath id="clip">
          <rect
            x={zeroPosition[0]}
            y={0}
            width={width - 20 - zeroPosition[0]}
            height={zeroPosition[1]}
          />
        </clipPath>
      </defs>
      <g>
        <Axis
          scale={xScale}
          position={[0, zeroPosition[1]]}
          direction={DirectionValue.BOTTOM}
        />
        <Axis
          scale={yScale}
          position={[zeroPosition[0], 0]}
          direction={DirectionValue.LEFT}
        />
        <g clipPath="url(#clip)">
          {series.map((item: any, index: number) => {
            return (
              <Path
                id={item.key as string}
                key={index}
                attributes={{
                  fill: colorScale(String(index)) as string,
                  d: areaFunc(item) as string,
                }}
              />
            );
          })}
        </g>
      </g>
      <g transform={`translate(0, ${zeroPosition[1] + 20})`}>
        <Axis
          scale={brushScale}
          position={[0, 40]}
          direction={DirectionValue.BOTTOM}
        />
        <g ref={brushRef} />
      </g>
    </svg>
  );
};

export default StackChart;

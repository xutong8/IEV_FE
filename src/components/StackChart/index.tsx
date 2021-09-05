import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3";
import { area, stack } from "d3-shape";
import Axis, { DirectionValue } from "../Axis";
import { areaData } from "@/utils/processAreaData";
import { useMemo } from "react";
import Path from "../Path";

export interface IStackChartProps {
  width: number;
  height: number;
}

const StackChart: React.FC<IStackChartProps> = (props) => {
  const { width, height } = props;

  const zeroPosition = [100, height - 20];

  // 映射获得年数组
  const years = useMemo(() => areaData.map((item) => item.date), []);
  // 获取最小年
  const minYear = useMemo(() => Math.min(...years), [years]);
  // 获取最大年
  const maxYear = useMemo(() => Math.max(...years), [years]);

  // 使用stack函数计算得到堆叠后的数据
  const series = stack().keys((areaData as any).columns.slice(1))(areaData);

  // TODO: 修改domain
  // x轴的scale
  const xScale = scaleLinear()
    .domain([minYear, maxYear])
    .range([zeroPosition[0], width - 20]);

  // 最后一行的数据
  const lastItems = series[series.length - 1].map((item) => item[1]);

  // y的最大值
  const maxY = useMemo(() => Math.max(...lastItems), [lastItems]);

  // y轴的scale
  const yScale = scaleLinear().domain([0, maxY]).range([zeroPosition[1], 20]);

  const areaFunc = area()
    .x((d: any) => xScale(Number(d.data.date)))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const colorScale = scaleOrdinal()
    .domain((areaData as any).columns.slice(1))
    .range(schemeCategory10);

  return (
    <svg width={width} height={height}>
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
      <g>
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
    </svg>
  );
};

export default StackChart;

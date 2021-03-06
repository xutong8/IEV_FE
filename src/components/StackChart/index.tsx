import { scaleLinear } from "d3-scale";
import { area, stack, line } from "d3-shape";
import Axis, { DirectionValue } from "../Axis";
import { IStackAreaData } from "@/types/areaChart";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Path from "../Path";
import Legend from "../Legend";
import { brushX } from "d3-brush";
import { select } from "d3-selection";
import { processTicks, processTicksByMax } from "@/utils/processTicks";
import { colorMap } from "@/utils/generateCountryColor";
import dataSource from "@/data/nameToDigit2.json";
import { namesToColumns, nationsToNames } from "@/utils/namesToColumns";
import styles from "./index.less";
import ceil from "lodash/ceil";
import Tooltip from "../Tooltip";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";
import { httpRequest } from "@/services";
import { unstable_batchedUpdates } from "react-dom";
import { Spin, Switch } from "antd";
import { filterObjectKeys } from "@/utils/filterObjectKeys";
import Title from "../Title";

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

  const legendHeight = height * 0.2;
  const switchHeight = 25;

  // brush在Y轴上的偏移
  const BrushYOffset = 25;

  // (0, 0)点的位置
  const zeroPosition = useMemo(() => [40, height - 100], [height]);
  // 面积图数据
  const [areaData, setAreaData] = useState<IStackAreaData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  // 过滤的列表
  const [filterList, setFilterList] = useState<Array<string>>([]);
  // hover的国家
  const [hoverCountry, setHoverCountry] = useState<string>("");

  const areaDataRef = useRef<IStackAreaData[]>();
  const unitTextRef = useRef<SVGTextElement>(null);

  // 映射获得年数组
  const years = useMemo(() => areaData.map((item) => item.date), [areaData]);
  // 获取最小年
  const minYear = useMemo(() => Math.min(...years), [years]);
  // 获取最大年
  const maxYear = useMemo(() => Math.max(...years), [years]);
  console.log(areaData);
  // 使用stack函数计算得到堆叠后的数据
  const series = useMemo(
    () => (areaData.length !== 0 ? stack().keys(columns)(areaData) : []),
    [areaData, columns]
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
  const lastItems = useMemo(
    () =>
      series.length !== 0
        ? series[series.length - 1].map((item) => item[1])
        : [],
    [series]
  );

  // y的最大值
  const maxY = useMemo(() => ceil(Math.max(...lastItems)), [lastItems]);

  // y轴的刻度数量
  const Y_TICKS = 8;

  // 处理ticks
  const yTicks = processTicksByMax(maxY, Y_TICKS);

  // y轴的scale
  const yScale = scaleLinear()
    .domain([0, maxY])
    .range([zeroPosition[1], legendHeight + switchHeight + 30]);

  // 计算area的path d属性
  const areaFunc = area()
    .x((d: any) => xScale(Number(d.data.date)))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const lineFunc = line()
    .x((d: any) => xScale(Number(d.data.date)))
    // .y0((d) => yScale(d[0]))
    .y((d) => yScale(d[1]));

  // 移入area path事件的处理器
  const onMouseEnter = useCallback(
    (hoverName) => {
      setHoverCountry(hoverName);
    },
    [xScale, areaData]
  );

  // 移动area path事件的处理器
  const onMouseMove = useCallback(
    (hoverName, coordinates, e) => {
      const year = Math.round(xScale.invert(coordinates[0]));
      const value = areaData[year - 1995][hoverName].toFixed(3);

      toolTipRef.current.onMouseMove(e, {
        name: `${year} ${hoverName}`,
        value,
      });
    },
    [xScale, areaData]
  );

  // 移入legend事件的处理器
  const onLegendMouseEnter = (hoverName: string) => {
    setHoverCountry(namesToColumns.get(hoverName));
  };

  // 移除area path事件的处理器
  const onMouseLeave = useCallback(() => {
    setHoverCountry("");
    toolTipRef.current.onMouseLeave();
  }, []);

  // category selector
  const category = useSelector(
    (state: IStore) =>
      state.categoryObj.selectedCategory.map((item) => item.id),
    (prev, next) => isEqual(prev, next)
  );

  // columns ref
  const columnsRef = useRef<string[]>();

  // 向后端拉取数据
  const fetchData = (type: string) => {
    // 如果category长度为0，则跳过；
    if (category.length === 0) return;
    httpRequest
      .get(
        `/stack_chart?category=${JSON.stringify(category)}&queryvorq=${type}`
      )
      .then((res: any) => {
        unstable_batchedUpdates(() => {
          const columns = res?.data?.columns.splice(1) ?? [];
          setColumns(columns);
          columnsRef.current = columns;
          const areaData = res?.data?.data ?? [];
          setAreaData(areaData);
          areaDataRef.current = areaData;
        });
      });
  };

  // 每次category变动时，重新请求数据
  useEffect(() => {
    fetchData("v");
  }, [category]);

  // 点击legend事件的处理器
  const onClick = (digit2: string, state: boolean) => {
    // 更新过滤列表
    if (state) {
      const newFilterList = [...filterList, namesToColumns.get(digit2)];
      const newColumns = (columnsRef.current as string[]).filter(
        (column) => !newFilterList.includes(column)
      );
      setColumns(newColumns);
      setAreaData(
        filterObjectKeys(areaDataRef.current as IStackAreaData[], newFilterList)
      );
      setFilterList(newFilterList);
    } else {
      const newFilterList = filterList.filter(
        (item) => item !== namesToColumns.get(digit2)
      );
      const newColumns = (columnsRef.current as string[]).filter(
        (column) => !newFilterList.includes(column)
      );
      setColumns(newColumns);
      setAreaData(
        filterObjectKeys(areaDataRef.current as IStackAreaData[], newFilterList)
      );
      setFilterList(newFilterList);
    }
  };

  // 开关点击处理函数
  const onSwitch = (checked: boolean, e: Event) => {
    fetchData(checked ? "v" : "q");
    if (unitTextRef.current)
      unitTextRef.current.innerHTML = checked ? "$ Milion" : "Milion Tunnes";
  };

  // year selector
  const year = useSelector((state: IStore) => state.year);
  console.log(series);
  return (
    <div className={styles.container}>
      <Title title="StackChart"></Title>
      {areaData.length === 0 ? (
        <div className={styles.content}>
          <Spin />
        </div>
      ) : (
        <>
          <Tooltip ref={toolTipRef} />
          {/* {({ year, country, value }: any) =>
              `<div>${year} ${country} </div><div>value: ${value}</div>`
            } */}
          {/* 30为title的高度 */}
          <svg width={width} height={height - 30} ref={svgRef}>
            <foreignObject width="100%" height={legendHeight}>
              <div className={styles.legends}>
                <Legend
                  orient="row"
                  data={dataSource.results.map((item) => item.name)}
                  color={(label: string) => {
                    const item = dataSource.results.find(
                      (item) => item.name === label
                    );
                    return colorMap.get(item?.iso_2digit_alpha ?? "") ?? "";
                  }}
                  onClick={onClick}
                  onMouseEnter={onLegendMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              </div>
            </foreignObject>
            <foreignObject
              width="100%"
              height={switchHeight}
              y={legendHeight + 6}
              x={zeroPosition[0] - 30}
            >
              <Switch
                className={styles.switch}
                checkedChildren="value"
                unCheckedChildren="quantity"
                onClick={onSwitch}
                defaultChecked
              />
            </foreignObject>
            <defs>
              <filter id="lineBlur" x="0" y="0">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
              </filter>
              <clipPath id="clip-path">
                <rect
                  x={zeroPosition[0]}
                  y={legendHeight + switchHeight}
                  width={
                    width - 20 - zeroPosition[0] < 0
                      ? 0
                      : width - 20 - zeroPosition[0]
                  }
                  height={
                    zeroPosition[1] - legendHeight - switchHeight < 0
                      ? 0
                      : zeroPosition[1] - legendHeight - switchHeight
                  }
                />
              </clipPath>
              <clipPath id="clip-axis">
                <rect
                  x={zeroPosition[0] - 10}
                  y={zeroPosition[1]}
                  width={
                    width - zeroPosition[0] + 2 < 0
                      ? 0
                      : width - zeroPosition[0] + 2
                  }
                  height={20}
                />
              </clipPath>
              {series.map((item: any, index: number) => (
                <clipPath id={`${item.key}_clipPath`} key={index}>
                  <path d={areaFunc(item) as string} fill="#fff" />
                </clipPath>
              ))}
              {Array.from(colorMap.keys())?.map((item: any) => {
                return (
                  <linearGradient
                    key={item}
                    id={`grad_${item}`}
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{
                        stopColor: colorMap.get(item),
                        stopOpacity: 0.05,
                      }}
                    ></stop>
                    <stop
                      offset="100%"
                      style={{
                        stopColor: colorMap.get(item),
                        stopOpacity: 0.5,
                      }}
                    ></stop>
                  </linearGradient>
                );
              })}
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
                tickFormat={(tick) => Math.round(tick / 1000000)}
              />
              <text
                x={zeroPosition[0] - 30}
                y={legendHeight + switchHeight + 18}
                fontSize={12}
                ref={unitTextRef}
              >
                $ Milion
              </text>
              <g clipPath="url(#clip-path)">
                {series.map((item: any, index: number) => {
                  return (
                    /**
                     * 之前的堆栈的写法
                     * <Path
                      id={item.key}
                      key={index}
                      attributes={{
                        // fill:
                        //   hoverCountry && item.key === hoverCountry
                        //     ? "#8fce74"
                        //     : `url("#${item.key}")`,
                        d: areaFunc(item) as string,
                      }}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      onMouseMove={onMouseMove}
                      style={{
                        transition: "all .5s ease",
                        fill: `url("#grad_${item.key}")`,
                      }}
                    />
                     */

                    <g key={index}>
                      <path
                        id={`${item.key}_blur`}
                        d={lineFunc(item) as string}
                        style={{
                          fill: "none",
                          stroke: `${colorMap.get(item.key)}`,
                          strokeWidth: "10px",
                          filter: "url(#lineBlur)",
                          clipPath: `url(#${item.key}_clipPath)`,
                        }}
                      />
                      <path
                        id={item.key}
                        d={lineFunc(item) as string}
                        style={{
                          fill: "none",
                          stroke: `${colorMap.get(item.key)}`,
                          strokeWidth: "1px",
                        }}
                      />
                      {item.map((singleYear: any) => (
                        <circle
                          key={`${item.key}_${singleYear.data.date}`}
                          cx={xScale(Number(singleYear.data.date))}
                          cy={yScale(singleYear[1])}
                          r={2}
                          fill={colorMap.get(item.key)}
                        />
                      ))}
                    </g>
                  );
                })}
              </g>
            </g>
            <line
              x1={xScale(year)}
              y1={yScale(0)}
              x2={xScale(year)}
              y2={yScale(maxY)}
              strokeWidth={1}
              stroke="gray"
            />
            <g
              transform={`translate(0, ${zeroPosition[1] + BrushYOffset + 20})`}
            >
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
      )}
    </div>
  );
};

export default StackChart;

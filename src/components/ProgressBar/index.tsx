import { scaleLinear } from "d3-scale";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Axis, { DirectionValue } from "../Axis";
import styles from "./index.less";
import { select } from "d3-selection";
import { pointer, easeLinear } from "d3";
import { useTransition } from "@/hooks/useTransition";
import cn from "classnames";
import { useSVGSize } from "@/hooks/useSVGSize";
import { years } from "@/constants/years";
import { processTicks } from "@/utils/processTicks";
import { colorMap } from "@/utils/generateCountryColor";
import dataSource from "@/data/nameToDigit2.json";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_YEAR } from "@/constants/year";
import { httpRequest } from "@/services";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";
import { findCountryIdByName } from "@/utils/findCountryIdByName";
import { colorDomain, colorRange } from "@/constants/colorScale";
import { unstable_batchedUpdates } from "react-dom";
export interface IProgressBarProps {
  width: number | string;
  height: number | string;
  sourceCountry: string;
  targetCountry: string;
}

const ProgressBar: React.FC<IProgressBarProps> = (props) => {
  const { width, height, sourceCountry, targetCountry } = props;

  const dispatch = useDispatch();

  const axisHeight = 20;

  // svg ref
  const svgRef = useRef<SVGSVGElement>(null);

  // computed width and height
  const [computedWidth, computedHeight] = useSVGSize(svgRef);
  // 最小年
  const minYear = useMemo(() => Math.min(...years), []);
  // 最大年
  const maxYear = useMemo(() => Math.max(...years), []);

  // X轴的刻度数量为7个
  const X_TICKS = 6;
  // 处理ticks
  const yearTicks = processTicks<number>(years, X_TICKS);

  const xScale = scaleLinear()
    .domain([minYear, maxYear])
    .range([10, computedWidth - 30]);

  // 当前年份的x坐标
  const [lineX, setLineX] = useState<number>(0);

  useEffect(() => {
    setLineX(computedWidth - 30);
  }, [computedWidth]);

  const lines = useMemo(
    () => ({
      x1: lineX,
      x2: lineX,
    }),
    [lineX]
  );

  // countries state
  const [countriesId, setCountriesId] = useState<string[]>([]);

  const bars = useMemo(
    () => countriesId.map(() => ({ width: lineX })),
    [lineX, countriesId]
  );

  // TODO: 事件解除绑定
  const bindClick = () => {
    select(`.${styles.progressbar}`).on("click", (event: MouseEvent) => {
      const mouseX = pointer(event)[0];
      const newYear = Math.round(xScale.invert(mouseX));
      setLineX(xScale(newYear));
      dispatch({
        type: UPDATE_YEAR,
        payload: newYear,
      });
    });
  };

  useEffect(() => {
    bindClick();
  }, [xScale.range()]);

  const { attrState: barAttrState, setAttrState: setBarAttrState } =
    useTransition({
      className: "bar-transition",
      value: bars,
      deps: [bars],
      duration: 500,
      easingFunction: easeLinear,
    });

  const { attrState: lineAttrState } = useTransition({
    className: "line-transition",
    value: [lines],
    deps: [lines],
    duration: 500,
    easingFunction: easeLinear,
  });

  const category = useSelector(
    (state: IStore) =>
      state.categoryObj.selectedCategory.map((item) => item.id),
    (prev, next) => isEqual(prev, next)
  );

  const colorScale = useMemo(
    () => scaleLinear<string>().domain(colorDomain).range(colorRange),
    []
  );

  // timeline data
  const [timelineData, setTimelineData] = useState<any>();

  // 获取timeline接口的数据
  const fetchData = () => {
    // 如果category为空，则跳过；
    if (category.length === 0) return;

    httpRequest
      .get(
        `/timeline?category=${JSON.stringify(
          category
        )}&selectedCountries=${JSON.stringify([
          findCountryIdByName(sourceCountry),
          findCountryIdByName(targetCountry),
        ])}`
      )
      .then((res: any) => {
        const data = res?.data ?? {};
        const newCountriesId = Object.keys(data);
        unstable_batchedUpdates(() => {
          setBarAttrState(newCountriesId.map(() => ({ width: lineX })));
          setCountriesId(newCountriesId);
          setTimelineData(data);
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [category, sourceCountry, targetCountry]);

  return (
    <svg
      width={width}
      height={height}
      className={styles.progressbar}
      ref={svgRef}
    >
      <foreignObject width="100%" height="100%">
        {(barAttrState as { width: number }[]).map((item, index) => {
          return (
            <div
              className="bar-transition"
              key={index}
              style={{
                width: item.width - 10,
                height:
                  countriesId.length !== 0
                    ? (computedHeight - axisHeight) / countriesId.length
                    : 0,
                opacity: 0.6,
                background: colorScale(timelineData[countriesId[index]][0]),
                marginLeft: 10,
              }}
            />
          );
        })}
      </foreignObject>
      <line
        className={cn({
          [styles.tooltip]: true,
          "line-transition": true,
        })}
        x1={lineAttrState.x1 as number}
        y1={0}
        x2={lineAttrState.x2 as number}
        y2={computedHeight - axisHeight}
        strokeWidth={4}
      />
      <Axis
        direction={DirectionValue.BOTTOM}
        position={[0, computedHeight - axisHeight]}
        scale={xScale}
        ticks={X_TICKS}
        tickValues={yearTicks}
      />
    </svg>
  );
};

export default ProgressBar;

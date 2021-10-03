import { scaleLinear } from "d3-scale";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Axis, { DirectionValue } from "../Axis";
import styles from "./index.less";
import { select } from "d3-selection";
import { pointer } from "d3";
import cn from "classnames";
import { years } from "@/constants/years";
import { processTicks } from "@/utils/processTicks";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_YEAR } from "@/constants/year";
import { httpRequest } from "@/services";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";
import { findCountryIdByName } from "@/utils/findCountryIdByName";
import { colorDomain, colorRange } from "@/constants/colorScale";
import { unstable_batchedUpdates } from "react-dom";
import { uniteVal } from "@/utils/uniteVal";
export interface IProgressBarProps {
  width: number;
  height: number;
  sourceCountry: string;
  targetCountry: string;
}

const ProgressBar: React.FC<IProgressBarProps> = (props) => {
  const { width, height, sourceCountry, targetCountry } = props;

  const dispatch = useDispatch();

  const axisHeight = 20;

  const BASE_YEAR = 1995;

  // svg ref
  const svgRef = useRef<SVGSVGElement>(null);

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
    .range([10, width - 30]);

  // 当前年份的x坐标
  const [lineX, setLineX] = useState<number>(0);

  const lineState = useMemo(
    () => ({
      x1: lineX,
      x2: lineX,
    }),
    [lineX]
  );

  // countries state
  const [countriesId, setCountriesId] = useState<string[]>([]);

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

  // year selector
  const year = useSelector((state: IStore) => state.year);

  useEffect(() => {
    bindClick();
  }, [xScale.range()]);

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
          setCountriesId(newCountriesId);
          setTimelineData(data);
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [category, sourceCountry, targetCountry]);

  useEffect(() => {
    setLineX(xScale(year));
  }, [width, year]);

  return (
    <svg
      width={width}
      height={height}
      className={styles.progressbar}
      ref={svgRef}
    >
      <foreignObject width="100%" height="100%">
        <div className={styles.pixmaps} style={{ height: height - axisHeight }}>
          {countriesId.map((item) => {
            return (
              <div
                className={styles.container}
                style={{
                  width: lineX - 10,
                  height: (height - axisHeight) / countriesId.length,
                }}
                key={item}
              >
                {uniteVal((timelineData[item] ?? []) as any[]).map(
                  (val, index) => {
                    if (index >= year - BASE_YEAR) {
                      return null;
                    }

                    return (
                      <div
                        className={cn({
                          "bar-transition": true,
                          [styles.transition]: true,
                          [styles.item]: true,
                        })}
                        key={index}
                        style={{
                          width: (width - 40) / (years.length - 1),
                          backgroundImage: `linear-gradient(${colorScale(
                            val[0]
                          )}, ${colorScale(val[1])})`,
                        }}
                      />
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
      </foreignObject>
      <line
        className={cn({
          [styles.tooltip]: true,
          "line-transition": true,
          [styles.transition]: true,
        })}
        x1={lineState.x1 as number}
        y1={0}
        x2={lineState.x2 as number}
        y2={height - axisHeight}
        strokeWidth={4}
      />
      <Axis
        direction={DirectionValue.BOTTOM}
        position={[0, height - axisHeight]}
        scale={xScale}
        ticks={X_TICKS}
        tickValues={yearTicks}
      />
    </svg>
  );
};

export default ProgressBar;

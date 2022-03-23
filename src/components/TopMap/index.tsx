import React, { useEffect, useMemo, useRef, useState } from "react";
import ComposedBarChart from "../ComposedBarChart";
import CountryMap from "../CountryMap";
import HeatMap from "../HeatMap";
import styles from "./index.less";
import coordinatesData from "@/data/coordinates.json";
import { useSVGSize } from "@/hooks/useSVGSize";
import { selectAll } from "d3-selection";
import { httpRequest } from "@/services";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";
import { Spin } from "antd";
import Title from "../Title";
import { numberFormat, numberFormatE } from "@/utils/number";
import cn from "classnames";
export interface ILineObj {
  name: string;
  lineCoordinates: IPoint[];
}

export interface IPoint {
  x: number;
  y: number;
}

export interface ITopMapProps {
  year: number;
}

export interface ICountryItem {
  countryName: string;
  expvalue: number;
}
export interface ICountry {
  countryName: string;
  exptotal: number;
  imptotal: number;
  explist: ICountryItem[];
}

const TopMap: React.FC<ITopMapProps> = (props) => {
  // 年份
  const { year } = props;

  // category selector
  const category = useSelector(
    (state: IStore) =>
      state.categoryObj.selectedCategory.map((item) => item.id),
    (prev, next) => isEqual(prev, next)
  );

  // 圆的半径
  const circleRadius = 4;
  // 柱状图的宽度
  const barWidth = 100;
  // 高度的基准值
  const fixedHeight = 237;

  const containerRef = useRef<HTMLDivElement>(null);

  // 柱状图的高度
  const [, barHeight] = useSVGSize(containerRef);
  // 热力图的宽度和高度
  const heatmapHeight = barHeight / Math.sqrt(2);

  // 线的数组
  const [lines, setLines] = useState<ILineObj[]>([]);

  // basic chart数据
  const [dataSource, setDataSource] = useState<ICountry[]>([]);

  // 国家的列表
  const countryNames = useMemo(
    () => dataSource.map((item) => item.countryName),
    [dataSource]
  );

  // 获取数据
  const fetchData = () => {
    // 如果category长度为0，则跳过；
    if (category.length === 0) return;

    httpRequest
      .get(`/base_chart?year=${year}&category=${JSON.stringify(category)}`)
      .then((res: any) => {
        const newDataSource = coordinatesData.coordinates.map((item) => {
          return (res.data ?? []).find(
            (country: ICountry) => country.countryName === item.name
          );
        });
        setDataSource(newDataSource);
      });
  };

  const barDataSource = useMemo(
    () =>
      dataSource.map((item) => ({
        // 修改了名称，改变了方向
        countryName: item.countryName,
        imptotal: item.exptotal,
        exptotal: item.imptotal,
      })),
    [dataSource]
  );

  const heatmapDataSource = useMemo(
    () =>
      dataSource.map((item) => ({
        countryName: item.countryName,
        explist: item.explist,
      })),
    [dataSource]
  );

  useEffect(() => {
    fetchData();
  }, [year, category]);

  // heatmap父容器div
  const heatmapContainerRef = useRef<HTMLDivElement>(null);

  // 计算线的坐标
  const drawLines = () => {
    const namesLen = countryNames.length;

    const yStart1 = -5;

    const heatmapRect = document
      .querySelectorAll(".heatmap")[0]
      .getBoundingClientRect();

    const xStart1 =
      (heatmapRect.left ?? 0) -
      (containerRef.current?.getBoundingClientRect().left ?? 0) +
      heatmapRect.width / 2 +
      5;

    const lines = [];
    const coordinates = coordinatesData.coordinates;

    for (let i = 0; i < namesLen; i++) {
      const country = coordinates[i];
      const startPointX =
        (((country?.x ?? 0) + Math.floor(circleRadius / 2)) * mapHeight) /
        fixedHeight;
      const startPointY =
        (((country?.y ?? 0) + Math.floor(circleRadius / 2)) * mapHeight) /
        fixedHeight;

      const lineObj = {} as ILineObj;
      const lineCoordinates = [] as any[];
      lineObj.name = countryNames[i];
      lineObj.lineCoordinates = lineCoordinates;

      // 地图上的点
      lineCoordinates.push({
        x: startPointX,
        y: startPointY,
      });

      // 中间点
      const midPointY =
        yStart1 + ((barHeight + 20) / (2 * (namesLen + 1))) * (i + 1);
      const midPointX = Math.abs(startPointY - midPointY) + startPointX;
      lineCoordinates.push({
        x: midPointX,
        y: midPointY,
      });

      const endPointX =
        xStart1 - ((barHeight + 20) / (2 * (namesLen + 1))) * (i + 1);
      const endPointY = midPointY;

      // 热力图上的点
      lineCoordinates.push({
        x: endPointX,
        y: endPointY,
      });

      // 文本上的点
      lineCoordinates.push({
        x: xStart1 + ((barHeight + 20) / (2 * (namesLen + 1))) * (i + 1),
        y: endPointY,
      });
      lines.push(lineObj);
    }

    const yStart2 =
      (heatmapContainerRef.current?.getBoundingClientRect().height ?? 0) + 6;
    const xStart2 =
      (heatmapRect.left ?? 0) -
      (containerRef.current?.getBoundingClientRect().left ?? 0) +
      heatmapRect.width / 2 +
      5;

    for (let i = 0; i < namesLen; i++) {
      const country = coordinates[i];
      const startPointX =
        (((country?.x ?? 0) + Math.floor(circleRadius / 2)) * mapHeight) /
        fixedHeight;
      const startPointY =
        ((country?.y ?? 0 + Math.floor(circleRadius / 2)) * mapHeight) /
          fixedHeight +
        mapHeight;

      const lineObj = {} as ILineObj;
      const lineCoordinates = [] as any[];
      lineObj.name = countryNames[i];
      lineObj.lineCoordinates = lineCoordinates;

      // 地图上的点
      lineCoordinates.push({
        x: startPointX,
        y: startPointY,
      });

      // 中间点
      const midPointY =
        yStart2 -
        ((barHeight + 20) / (2 * (namesLen + 1))) * (namesLen - 1 - i + 1);
      const midPointX = Math.abs(startPointY - midPointY) + startPointX;
      lineCoordinates.push({
        x: midPointX,
        y: midPointY,
      });

      const endPointX =
        xStart2 -
        ((barHeight + 20) / (2 * (namesLen + 1))) * (namesLen - 1 - i + 1);
      const endPointY = midPointY;

      // 热力图上的点
      lineCoordinates.push({
        x: endPointX,
        y: endPointY,
      });

      // 文本上的点
      lineCoordinates.push({
        x:
          xStart2 +
          ((barHeight + 20) / (2 * (namesLen + 1))) * (namesLen - 1 - i + 1),
        y: endPointY,
      });

      lines.push(lineObj);
    }
    setLines(lines);
  };

  const ARROW_VAL = 4;

  // 计算线上的各个点
  const getLineD = (line: IPoint[], isReverse = false) => {
    const basePath = `L${line[1].x} ${line[1].y} L${line[2].x} ${line[2].y}`;
    if (!isReverse) {
      return `M${line[0].x} ${line[0].y} ${basePath} L${
        line[2].x - ARROW_VAL
      } ${line[2].y - ARROW_VAL} L${line[2].x} ${line[2].y} L${
        line[2].x - ARROW_VAL
      } ${line[2].y + ARROW_VAL}`;
    } else {
      return `M${line[0].x} ${line[0].y} L${line[0].x + ARROW_VAL + 2} ${
        line[0].y
      } L${line[0].x} ${line[0].y} L${line[0].x} ${
        line[0].y + (line[0].y < line[1].y ? ARROW_VAL + 2 : -ARROW_VAL - 2)
      } L${line[0].x} ${line[0].y} ${basePath}`;
    }
  };

  useEffect(() => {
    selectAll(`.${styles.countryMap} svg`).attr("height", barHeight / 2);
  }, [barHeight]);

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapWidth, mapHeight] = useSVGSize(mapRef);

  useEffect(() => {
    drawLines();
  }, [countryNames]);

  const [topmapWidth, topmapHeight] = useSVGSize(containerRef);

  const maxValue = useMemo(
    () =>
      Math.max(
        ...heatmapDataSource.map((item) =>
          Math.max(...item.explist.map((exp) => exp.expvalue))
        )
      ),
    [heatmapDataSource]
  );

  return (
    <div className={styles.topmap}>
      <Title title="Trade Flow"></Title>
      <div className={styles.content}>
        <Spin spinning={category.length === 0} wrapperClassName={styles.spin}>
          <div className={styles.container} ref={containerRef}>
            <div
              className={styles.colorScale}
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(39, 129, 229, 1), rgba(39, 129, 229, 0.3))",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -5,
                  left: -25,
                  width: 55,
                  fontSize: 12,
                  fontWeight: 450,
                }}
              >
                {numberFormatE(maxValue)}
              </div>
              <div
                style={{
                  position: "absolute",
                  // bottom: -20,
                  top: -5,
                  right: -7,
                  fontSize: 12,
                  fontWeight: 450,
                }}
              >
                0
              </div>
            </div>
            <div className={styles.left}>
              <div className={styles.map} ref={mapRef}>
                <CountryMap
                  name="World"
                  className={styles.countryMap}
                  style={{
                    width: mapWidth,
                    height: mapHeight,
                  }}
                />
                {coordinatesData.coordinates.map((item) => {
                  return (
                    <div
                      key={item.name}
                      className={styles.circle}
                      style={{
                        left: (item.x * mapHeight) / fixedHeight,
                        top: (item.y * mapHeight) / fixedHeight,
                      }}
                    />
                  );
                })}
              </div>
              <div className={styles.map}>
                <CountryMap
                  name="World"
                  className={styles.countryMap}
                  style={{
                    width: mapWidth,
                    height: mapHeight,
                  }}
                />
                {coordinatesData.coordinates.map((item) => {
                  return (
                    <div
                      key={item.name}
                      className={cn({
                        [styles.circle]: true,
                        [`circle_${item.name}`]: true,
                      })}
                      style={{
                        left: (item.x * mapHeight) / fixedHeight,
                        top: (item.y * mapHeight) / fixedHeight,
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div className={styles.middle}>
              <ComposedBarChart
                width={barWidth}
                height={barHeight}
                dataSource={barDataSource}
              />
            </div>
            <div className={styles.right} ref={heatmapContainerRef}>
              <HeatMap
                width={heatmapHeight}
                height={heatmapHeight}
                dataSource={heatmapDataSource}
                className="heatmap"
                maxValue={maxValue}
              />
            </div>
          </div>
          <svg width={topmapWidth} height={topmapHeight} className={styles.svg}>
            {lines.map((line: ILineObj, index: number) => {
              return (
                <path
                  key={index}
                  d={`${getLineD(
                    line.lineCoordinates,
                    index >= countryNames.length
                  )}`}
                  className={`line_${line.name}`}
                  stroke="#595a5a"
                  strokeOpacity="0.4"
                />
              );
            })}
            {lines.map((line: ILineObj, index: number) => {
              const textPos = line.lineCoordinates[3];
              const len = coordinatesData.coordinates.length;
              return (
                <text
                  className={`text_${line.name}`}
                  key={index}
                  x={textPos.x}
                  y={textPos.y}
                  fontSize={9}
                  dx={-6}
                  dy={3}
                  fillOpacity={0.4}
                >
                  {coordinatesData.coordinates[index % len].iso_2digit_alpha}
                </text>
              );
            })}
          </svg>
        </Spin>
      </div>
    </div>
  );
};

export default React.memo(TopMap);

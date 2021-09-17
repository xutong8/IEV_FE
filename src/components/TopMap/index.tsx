import React, { useEffect, useMemo, useRef, useState } from "react";
import ComposedBarChart from "../ComposedBarChart";
import CountryMap from "../CountryMap";
import HeatMap from "../HeatMap";
import styles from "./index.less";
import coordinatesData from "@/data/coordinates.json";
import cn from "classnames";
import { useSVGSize } from "@/hooks/useSVGSize";
import { selectAll } from "d3-selection";
import { httpRequest } from "@/services";
export interface IPoint {
  x: number;
  y: number;
}

export interface ITopMapProps {
  year: string;
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

  // 圆的半径
  const circleRadius = 6;
  // 柱状图的宽度
  const barWidth = 200;

  const containerRef = useRef<HTMLDivElement>(null);

  // 柱状图的高度
  const [, barHeight] = useSVGSize(containerRef);
  // 热力图的宽度和高度
  const heatmapHeight = barHeight / Math.sqrt(2);
  // 国家的列表
  const countryNames = useMemo(
    () => ["Usa", "China", "Japan", "England", "Italy", "Germany", "France"],
    []
  );

  // 线的数组
  const [lines, setLines] = useState<IPoint[][]>([]);

  // 种类的数组
  const [category, setCategory] = useState<string[]>([]);

  // basic chart数据
  const [dataSource, setDataSource] = useState<ICountry[]>([]);

  // 获取数据
  const fetchData = () => {
    httpRequest
      .get(`/base_chart?year=${year}&category=${JSON.stringify(category)}`)
      .then((res: any) => {
        setDataSource(res?.data ?? []);
      });
  };

  const barDataSource = useMemo(
    () =>
      dataSource.map((item) => ({
        countryName: item.countryName,
        exptotal: item.exptotal,
        imptotal: item.imptotal,
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

  // 计算线的坐标
  const getLinesCoordinates = () => {
    const namesLen = countryNames.length;
    // TODO: 终点位置需要重新计算
    const yStart = -2;
    const xStart = 560;
    const linesCoordinates = [];
    const coordinates = coordinatesData.coordinates;
    // TODO: 考虑另外一边
    for (let i = 0; i < namesLen; i++) {
      const lineCoordinates = [];
      const countryName = countryNames[i % namesLen];
      const country = coordinates.find((item) => item.name === countryName);
      const startPointX = country?.x ?? 0;
      const startPointY = country?.y ?? 0;

      // 地图上的点
      lineCoordinates.push({
        x: startPointX + circleRadius / 2,
        y: startPointY + (i >= namesLen ? barHeight / 2 : 0) + circleRadius / 2,
      });

      // 中间点
      const midPointY = yStart + (barHeight / (2 * (namesLen + 1))) * (i + 1);
      const midPointX = Math.abs(startPointY - midPointY) + startPointX;
      lineCoordinates.push({
        x: midPointX,
        y: midPointY + (i >= namesLen ? barHeight / 2 : 0),
      });

      const endPointX = xStart - (barHeight / (2 * (namesLen + 1))) * (i + 1);
      const endPointY = midPointY;

      // 热力图上的点
      lineCoordinates.push({
        x: endPointX,
        y: endPointY + (i >= namesLen ? barHeight / 2 : 0),
      });
      linesCoordinates.push(lineCoordinates);
    }

    setLines(linesCoordinates);
  };

  // 计算线上的各个点
  const getLineD = (line: IPoint[]) => {
    return `M${line[0].x} ${line[0].y} L${line[1].x} ${line[1].y} L${line[2].x} ${line[2].y}`;
  };

  useEffect(() => {
    selectAll(`.${styles.countryMap} svg`).attr("height", barHeight / 2);
  }, [barHeight]);

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapWidth, mapHeight] = useSVGSize(mapRef);

  return (
    <div className={styles.topmap}>
      <div className={styles.container} ref={containerRef}>
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
            {/* {coordinatesData.coordinates.map((item) => {
              return (
                <div
                  key={item.name}
                  className={styles.circle}
                  style={{
                    left: `${(item.x / 576) * 100}%`,
                    top: `${(item.y / 237) * 100}%`,
                  }}
                />
              );
            })} */}
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
            {/* {coordinatesData.coordinates.map((item) => {
              return (
                <div
                  key={item.name}
                  className={cn({
                    [styles.circle]: true,
                  })}
                  style={{
                    left: `${(item.x / 576) * 100}%`,
                    top: `${(item.y / 237) * 100}%`,
                  }}
                />
              );
            })} */}
          </div>
        </div>
        <div className={styles.middle}>
          <ComposedBarChart
            width={barWidth}
            height={barHeight}
            dataSource={barDataSource}
          />
        </div>
        <div className={styles.right}>
          <HeatMap
            width={heatmapHeight}
            height={heatmapHeight}
            dataSource={heatmapDataSource}
          />
        </div>
      </div>
      <svg width="100%" height="100%" className={styles.svg}>
        {lines.slice(0, 2).map((line: IPoint[], index: number) => {
          return <path key={index} d={`${getLineD(line)}`} />;
        })}
      </svg>
    </div>
  );
};

export default React.memo(TopMap);

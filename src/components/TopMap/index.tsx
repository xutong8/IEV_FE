import React, { useEffect, useMemo, useRef, useState } from "react";
import ComposedBarChart from "../ComposedBarChart";
import CountryMap from "../CountryMap";
import HeatMap from "../HeatMap";
import styles from "./index.less";
import coordinatesData from "@/data/coordinates.json";
import { useSVGSize } from "@/hooks/useSVGSize";
import { selectAll } from "d3-selection";
import { httpRequest } from "@/services";
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

  // 圆的半径
  const circleRadius = 4;
  // 柱状图的宽度
  const barWidth = 200;

  const containerRef = useRef<HTMLDivElement>(null);

  // 柱状图的高度
  const [, barHeight] = useSVGSize(containerRef);
  // 热力图的宽度和高度
  const heatmapHeight = barHeight / Math.sqrt(2);

  // 线的数组
  const [lines, setLines] = useState<IPoint[][]>([]);

  // 种类的数组
  const [category, setCategory] = useState<string[]>([]);

  // basic chart数据
  const [dataSource, setDataSource] = useState<ICountry[]>([]);

  // 国家的列表
  const countryNames = useMemo(
    () => dataSource.map((item) => item.countryName),
    [dataSource]
  );

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

    const linesCoordinates = [];
    const coordinates = coordinatesData.coordinates;

    for (let i = 0; i < namesLen; i++) {
      const country = coordinates[i];
      const startPointX =
        (((country?.x ?? 0) + Math.floor(circleRadius / 2)) * mapHeight) / 237;
      const startPointY =
        (((country?.y ?? 0) + Math.floor(circleRadius / 2)) * mapHeight) / 237;
      const lineCoordinates = [];

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
      linesCoordinates.push(lineCoordinates);
    }

    const yStart2 =
      (heatmapContainerRef.current?.getBoundingClientRect().height ?? 0) + 6;
    const xStart2 =
      (heatmapRect.left ?? 0) -
      (containerRef.current?.getBoundingClientRect().left ?? 0) +
      heatmapRect.width / 2 +
      5;

    for (let i = namesLen - 1; i >= 0; i--) {
      const country = coordinates[i];
      const startPointX =
        (((country?.x ?? 0) + Math.floor(circleRadius / 2)) * mapHeight) / 237;
      const startPointY =
        ((country?.y ?? 0 + Math.floor(circleRadius / 2)) * mapHeight) / 237 +
        mapHeight;
      const lineCoordinates = [];

      // 地图上的点
      lineCoordinates.push({
        x: startPointX,
        y: startPointY,
      });

      // 中间点
      const midPointY =
        yStart2 - ((barHeight + 20) / (2 * (namesLen + 1))) * (i + 1);
      const midPointX = Math.abs(startPointY - midPointY) + startPointX;
      lineCoordinates.push({
        x: midPointX,
        y: midPointY,
      });

      const endPointX =
        xStart2 - ((barHeight + 20) / (2 * (namesLen + 1))) * (i + 1);
      const endPointY = midPointY;

      // 热力图上的点
      lineCoordinates.push({
        x: endPointX,
        y: endPointY,
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

  useEffect(() => {
    drawLines();
  }, [countryNames]);

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
            {coordinatesData.coordinates.map((item) => {
              return (
                <div
                  key={item.name}
                  className={styles.circle}
                  style={{
                    left: (item.x * mapHeight) / 237,
                    top: (item.y * mapHeight) / 237,
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
                  className={styles.circle}
                  style={{
                    left: (item.x * mapHeight) / 237,
                    top: (item.y * mapHeight) / 237,
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
          />
        </div>
      </div>
      <svg width="100%" height="100%" className={styles.svg}>
        {lines.map((line: IPoint[], index: number) => {
          return <path key={index} d={`${getLineD(line)}`} />;
        })}
      </svg>
    </div>
  );
};

export default React.memo(TopMap);

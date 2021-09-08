import { useEffect, useMemo, useState } from "react";
import ComposedBarChart from "../ComposedBarChart";
import CountryMap from "../CountryMap";
import HeatMap from "../HeatMap";
import styles from "./index.less";
import coordinatesData from "@/data/coordinates.json";
import cn from "classnames";

export interface IPoint {
  x: number;
  y: number;
}

const TopMap = () => {
  // 圆的半径
  const circleRadius = 6;
  // 柱状图的宽度
  const barWidth = 100;
  // 柱状图的高度
  const barHeight = 300;
  // 热力图的宽度和高度
  const heatmapHeight = barHeight / Math.sqrt(2);
  // 年份
  const year = "1995";
  // 种类
  const category = "Rice";
  // 国家的列表
  const countryNames = useMemo(
    () => ["Usa", "China", "Japan", "England", "Italy", "Germany", "France"],
    []
  );

  const [lines, setLines] = useState<IPoint[][]>([]);

  const getLinesCoordinates = () => {
    const namesLen = countryNames.length;
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

    console.log("linesCoordinates: ", linesCoordinates);
    setLines(linesCoordinates);
  };

  const getLineD = (line: IPoint[]) => {
    return `M${line[0].x} ${line[0].y} L${line[1].x} ${line[1].y} L${line[2].x} ${line[2].y}`;
  };

  useEffect(() => {
    getLinesCoordinates();
  }, []);

  return (
    <div className={styles.topmap}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.map}>
            <CountryMap name="World" large={true} />
            {coordinatesData.coordinates.map((item) => {
              return (
                <div
                  key={item.name}
                  className={styles.circle}
                  style={{ left: item.x, top: item.y }}
                />
              );
            })}
          </div>
          <div className={styles.map}>
            <CountryMap name="World" large={true} />
            {coordinatesData.coordinates.map((item) => {
              return (
                <div
                  key={item.name}
                  className={cn({
                    [styles.circle]: true,
                  })}
                  style={{ left: item.x, top: item.y }}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.middle}>
          <ComposedBarChart
            width={barWidth}
            height={barHeight}
            countryNames={countryNames}
            year={year}
            category={category}
          />
        </div>
        <div className={styles.right}>
          <HeatMap
            width={heatmapHeight}
            height={heatmapHeight}
            countryNames={countryNames}
            year={year}
            category={category}
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

export default TopMap;
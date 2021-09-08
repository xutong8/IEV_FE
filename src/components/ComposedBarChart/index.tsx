import React, { useMemo } from "react";
import styles from "./index.less";
import { scaleLinear } from "d3-scale";
import { getLittleTradeData } from "@/utils/tradeUtil";
import BarChart from "./BarChart";

export interface IComposedBarChartProps {
  countryNames: string[];
  year: string;
  category: string;
  isReverse?: boolean;
  position?: [number, number];
  width: number;
  height: number;
}

const ComposedBarChart: React.FC<IComposedBarChartProps> = (props) => {
  const { countryNames, year, category, width, height } = props;

  // 根据countries、year和category拿到数据
  const dataSource = getLittleTradeData(countryNames, year, category);

  // 获取最大的exptotal
  const maxExpTotal = useMemo(
    () => Math.max(...dataSource.map((item) => item.exptotal)),
    [dataSource]
  );

  // 获取最小的imptotal
  const maxImpTotal = useMemo(
    () => Math.max(...dataSource.map((item) => item.imptotal)),
    [dataSource]
  );

  // 定义比例尺
  const scale = scaleLinear()
    .domain([0, Math.max(maxExpTotal, maxImpTotal)])
    .range([0, width / 2]);

  return (
    <div style={{ width, height }} className={styles.composedbar}>
      <div className={styles.item}>
        <BarChart dataSource={dataSource} scale={scale} />
      </div>
      <div className={styles.item}>
        <BarChart isReverse={true} dataSource={dataSource} scale={scale} />
      </div>
    </div>
  );
};

export default ComposedBarChart;

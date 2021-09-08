import { ITradeItem } from "@/utils/tradeUtil";
import { ScaleLinear } from "d3-scale";
import React, { useMemo } from "react";
import styles from "./index.less";

export interface IBarChartProps {
  isReverse?: boolean;
  dataSource: ITradeItem[];
  scale: ScaleLinear<number, number>;
}

const BarChart: React.FC<IBarChartProps> = (props) => {
  const { isReverse = false, dataSource, scale } = props;

  const reverseDirection = useMemo(
    () => (isReverse ? "row-reverse" : "row"),
    [isReverse]
  );
  const direction = useMemo(
    () => (isReverse ? "row" : "row-reverse"),
    [isReverse]
  );

  return (
    <div className={styles.barchart}>
      {dataSource.map((country) => (
        <div
          className={styles.row}
          key={country.countryName}
          style={{ flexDirection: reverseDirection }}
        >
          <div className={styles.left} style={{ flexDirection: direction }}>
            <div
              style={{ background: "gray", width: scale(country.exptotal) }}
            />
          </div>
          <div
            className={styles.right}
            style={{ flexDirection: reverseDirection }}
          >
            <div
              style={{ background: "brown", width: scale(country.imptotal) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
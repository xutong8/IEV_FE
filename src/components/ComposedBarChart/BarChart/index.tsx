import { IStore } from "@/reducers";
import { ITradeItem } from "@/utils/tradeUtil";
import cn from "classnames";
import { ScaleLinear } from "d3-scale";
import { isEqual } from "lodash";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./index.less";

export interface IBarChartProps {
  isReverse?: boolean;
  dataSource: ITradeItem[];
  scale: ScaleLinear<number, number>;
}

const BarChart: React.FC<IBarChartProps> = (props) => {
  const { isReverse = false, dataSource, scale } = props;

  const colors = useMemo(
    () => (!isReverse ? ["#c8c8c8", "#636363"] : ["#636363", "#c8c8c8"]),
    [isReverse]
  );

  // countryList selector
  const countryList = useSelector(
    (state: IStore) => state.countryList,
    (prev, next) => isEqual(prev, next)
  );

  return (
    <div className={styles.barchart}>
      {dataSource.map((country) => (
        <div
          className={cn({
            [styles.row]: true,
            [`${country.countryName}bar`]: true,
          })}
          key={country.countryName}
          style={{
            flexDirection: "row",
            opacity: 0.4,
          }}
        >
          <div className={styles.left} style={{ flexDirection: "row-reverse" }}>
            <div
              style={{
                background: colors[0],
                width: scale(country.exptotal),
              }}
            />
          </div>
          <div className={styles.right} style={{ flexDirection: "row" }}>
            <div
              style={{
                background: colors[1],
                width: scale(country.imptotal),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;

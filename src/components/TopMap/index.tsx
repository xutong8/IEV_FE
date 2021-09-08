import React from "react";
import ComposedBarChart from "../ComposedBarChart";
import CountryMap from "../CountryMap";
import HeatMap from "../HeatMap";
import styles from "./index.less";
import coordinatesData from "@/data/coordinates.json";

const TopMap = () => {
  return (
    <div className={styles.topmap}>
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
        </div>
      </div>
      <div className={styles.middle}>
        <ComposedBarChart
          width={100}
          height={300}
          countryNames={["China", "Usa", "Japan", "England"]}
          year="1995"
          category="Rice"
        />
      </div>
      <div className={styles.right}>
        <HeatMap
          width={212}
          height={212}
          countryNames={["China", "Usa", "Japan", "England"]}
          year="1995"
          category="Rice"
        />
      </div>
    </div>
  );
};

export default TopMap;

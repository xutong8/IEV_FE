import { useState } from "react";
import RadarChart from "../RadarChart";
import SearchDropDown from "../SearchDropDown";
import styles from "./index.less";

const RadarArea = () => {
  const [radarList, setRadarList] = useState<Array<string>>([]);
  const handleAddRadar = (name: string) => {
    setRadarList([...radarList, name]);
  };
  return (
    <div className={styles["radar_area"]}>
      <SearchDropDown width={72} addRadar={handleAddRadar} />
      <div className={styles["radar_chart_list"]}>
        {radarList?.map((item) => (
          <RadarChart
            key={item}
            title={item}
            draggable={true}
            style={{ flex: "0 0 20%" }}
          />
        ))}
      </div>
    </div>
  );
};

export default RadarArea;

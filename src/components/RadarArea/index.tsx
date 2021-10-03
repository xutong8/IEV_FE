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
    <div className={styles["radar_list"]}>
      <SearchDropDown width={72} addRadar={handleAddRadar} />
      {radarList?.map((item) => (
        <RadarChart key={item} title={item} draggable={true} />
      ))}
    </div>
  );
};

export default RadarArea;

import { useRef, useState } from "react";
import RadarChart from "../RadarChart";
import SearchDropDown from "../SearchDropDown";
import styles from "./index.less";

/**
 * 对应的就是界面中的Radar Chart区域，在RadarArea中渲染了下拉搜索框以及国家的雷达列表
 * @returns RadarArea组件
 */
const RadarArea = () => {
  const [radarList, setRadarList] = useState<Array<string>>([]);
  const RadarAreaRef = useRef<HTMLDivElement>(null);
  const handleAddRadar = (name: string) => {
    setRadarList([...radarList, name]);
  };
  const deleteItem = (name: string) => {
    const newList = radarList.filter((item) => item !== name);
    setRadarList([...newList]);
  };
  return (
    <div className={styles["radar_area"]} ref={RadarAreaRef}>
      <SearchDropDown
        width={72}
        addRadar={handleAddRadar}
        drawedRadar={radarList}
      />
      <div className={styles["radar_chart_list"]}>
        {radarList?.map((item) => (
          <RadarChart
            key={item}
            title={item}
            draggable={true}
            deleteItem={deleteItem}
            parentRef={RadarAreaRef}
            parentWidth={180}
          />
        ))}
      </div>
    </div>
  );
};

export default RadarArea;

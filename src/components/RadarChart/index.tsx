import { useSVGSize } from "@/hooks/useSVGSize";
import { CSSProperties, useRef, useMemo, useEffect } from "react";
import Radar from "./Radar";
import styles from "./index.less";
import { CloseCircleFilled } from "@ant-design/icons";

export interface IRadarChart {
  title: string;
  draggable: boolean;
  fontSize?: number;
  solveDrop?: (value: string) => void;
  deleteItem?: (name: string) => void;
  style?: CSSProperties;
}
/**
 * 绘制一个雷达图，包括radar以及title
 * @param props
 * @returns
 */
const RadarChart: React.FC<IRadarChart> = (props) => {
  const { title, style, fontSize, draggable, solveDrop, deleteItem } = props;
  const radarRef = useRef<HTMLDivElement>(null);
  const [radarWidth, radarHeight] = useSVGSize(radarRef);
  const radarSide = useMemo(
    () => Math.min(radarWidth, radarHeight),
    [radarWidth, radarHeight]
  );
  // useEffect(() => {}, [radarWidth, radarHeight]);
  const handleDragStart = (e: any) => {
    e.target.style.opacity = 0.5;
    e.dataTransfer.setData("text/plain", title);
  };
  const handleDragEnd = (e: any) => {
    e.target.style.opacity = "";
  };
  const handleDrop = (e: any) => {
    console.log(solveDrop, deleteItem);
    if (solveDrop) {
      const newName = e.dataTransfer.getData("text");
      solveDrop(newName);
    }
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
  };
  const handleCloseClick = () => {
    if (deleteItem) {
      deleteItem(title);
    }
  };
  return (
    <div
      className={`${styles["radar_container"]} ${
        draggable ? styles["display_list"] : ""
      }`}
      style={{ ...style }}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div ref={radarRef} className={styles["radar_chart"]}>
        {radarSide && (
          <Radar svgWidth={radarSide} svgHeight={radarSide} title={title} />
        )}
      </div>
      <div className={styles["radar_title"]} style={{ fontSize: fontSize }}>
        {title}
      </div>
      <CloseCircleFilled
        className={styles["close"]}
        onClick={handleCloseClick}
        style={{
          display: draggable ? "" : "none",
        }}
      />
    </div>
  );
};

export default RadarChart;

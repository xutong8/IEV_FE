import { useSVGSize } from "@/hooks/useSVGSize";
import { CSSProperties, useRef, useMemo, useEffect } from "react";
import Radar from "./Radar";
import styles from "./index.less";

export interface IRadarChart {
  title: string;
  draggable: boolean;
  solveDrop?: (value: string) => void;
  style?: CSSProperties;
}

const RadarChart: React.FC<IRadarChart> = (props) => {
  const { title, style, draggable, solveDrop } = props;
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
    if (solveDrop) {
      const newName = e.dataTransfer.getData("text");
      solveDrop(newName);
    }
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
    console.log("over");
  };
  return (
    <div
      className={styles["radar_container"]}
      style={{ ...style }}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={radarRef}
        className={styles["radar_chart"]}
        draggable="false"
        // style={{ width: radarSide, height: radarSide }}
      >
        {radarSide && <Radar svgWidth={radarSide} svgHeight={radarSide} />}
      </div>
      <div className={styles["radar_title"]} draggable="false">
        {title}
      </div>
    </div>
  );
};

export default RadarChart;

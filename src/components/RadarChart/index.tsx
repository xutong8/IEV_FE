import { useSVGSize } from "@/hooks/useSVGSize";
import { CSSProperties, useRef, useMemo } from "react";
import Radar from "./Radar";
import styles from "./index.less";
import { CloseCircleFilled, QuestionCircleOutlined } from "@ant-design/icons";
import Tooltip from "../Tooltip";
import TextWithTooltip from "../TextWithTooltip";

export interface IRadarChart {
  title: string;
  draggable: boolean;
  parentRef: any;
  color?: string;
  fontSize?: number;
  solveDrop?: (value: string) => void;
  deleteItem?: (name: string) => void;
  style?: CSSProperties;
  parentWidth?: number;
}
/**
 * 绘制一个雷达图，包括radar以及title
 * @param props
 * @returns
 */
const RadarChart: React.FC<IRadarChart> = (props) => {
  const {
    title,
    style,
    fontSize,
    draggable,
    color,
    solveDrop,
    deleteItem,
    parentRef,
    parentWidth,
  } = props;
  const radarRef = useRef<HTMLDivElement>(null);

  const [radarWidth, radarHeight] = useSVGSize(parentRef);

  const radarSide = useMemo(
    // 减去的为margin
    () => (parentWidth ? parentWidth : Math.min(radarWidth, radarHeight) - 20),
    [radarWidth, radarHeight, parentWidth]
  );
  console.log(radarWidth, radarHeight, radarSide);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: any) => {
    e.target.style.opacity = 0.5;
    e.dataTransfer.setData("text/plain", title);
  };
  const handleDragEnd = (e: any) => {
    e.target.style.opacity = "";
  };
  const handleDrop = (e: any) => {
    containerRef.current?.classList.remove(styles["enter"]);
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
  const handleDragEnter = (e: any) => {
    e.preventDefault();
    containerRef.current?.classList.add(styles["enter"]);
  };
  const handleDragLeave = () => {
    containerRef.current?.classList.remove(styles["enter"]);
  };
  return (
    <div
      className={`${styles["radar_container"]} ${
        draggable ? styles["display_list"] : styles["display_choose"]
      }`}
      ref={containerRef}
      style={{ ...style }}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOverCapture={handleDragEnter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragLeave}
    >
      <Tooltip ref={tooltipRef} />
      <div ref={radarRef} className={styles["radar_chart"]}>
        {radarSide && (
          <Radar
            radarSide={radarSide}
            title={title}
            color={color}
            tooltipRef={tooltipRef}
          />
        )}
      </div>
      <div className={styles["radar_title"]} style={{ fontSize: fontSize }}>
        <TextWithTooltip title={title} />
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

RadarChart.defaultProps = {
  color: "black",
};

export default RadarChart;

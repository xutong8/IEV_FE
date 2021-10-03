import { useSVGSize } from "@/hooks/useSVGSize";
import { CSSProperties, useRef, useMemo } from "react";
import Radar from "./Radar";
import styles from "./index.less";

export interface IRadarChart {
  title: string;
  style?: CSSProperties;
}

const RadarChart: React.FC<IRadarChart> = (props) => {
  const { title, style } = props;
  const radarRef = useRef<HTMLDivElement>(null);
  const [radarWidth, radarHeight] = useSVGSize(radarRef);
  const radarSide = useMemo(
    () => Math.min(radarWidth, radarHeight),
    [radarWidth, radarHeight]
  );
  console.log(radarSide);
  return (
    <div className={styles["radar_container"]} style={{ ...style }}>
      <div
        ref={radarRef}
        className={styles["radar_chart"]}
        // style={{ width: radarSide, height: radarSide }}
      >
        {radarSide && <Radar width={radarSide} height={radarSide} />}
      </div>
      <div className={styles["radar_title"]}>{title}</div>
    </div>
  );
};

export default RadarChart;

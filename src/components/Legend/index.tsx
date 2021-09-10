import { CSSProperties } from "react";
import LegendItem from "./LegendItem";
import styles from "./index.less";

export interface ILegend {
  color: (key: string) => string;
  orient: string;
  // Pos问题
  data: Array<string>;
  onClick: (digit2: string, state: boolean) => void;
  onMouseEnter: (e: any) => void;
  onMouseLeave: (e: any) => void;
}

const Legend: React.FC<ILegend> = (props) => {
  const { color, orient, data, onClick, onMouseEnter, onMouseLeave } = props;
  const style = { flexDirection: orient };

  return (
    <div className={styles["legend"]} style={style as CSSProperties}>
      {data.map((label: string, index: number) => (
        <LegendItem
          key={label}
          label={label}
          fill={color(label)}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ))}
    </div>
  );
};

export default Legend;

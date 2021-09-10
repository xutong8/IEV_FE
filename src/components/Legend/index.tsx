import { CSSProperties } from "react";
import LegendItem from "./LegendItem";
import styles from "./index.less";

export interface ILegend {
  color: ReadonlyArray<string>;
  orient: string;
  // Pos问题
  data: Array<string>;
  onClick: () => void;
}

const Legend: React.FC<ILegend> = (props) => {
  const { color, orient, data, onClick } = props;
  const style = { flexDirection: orient };

  return (
    <div className={styles["legend"]} style={style as CSSProperties}>
      {data.map((label: string, index: number) => (
        <LegendItem
          key={label}
          label={label}
          fill={color[index % color.length]}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default Legend;

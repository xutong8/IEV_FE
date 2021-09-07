import { CSSProperties } from "react";
import LegendItem from "./LegendItem";
import styles from "./index.less";

export interface ILegend {
  color: ReadonlyArray<string>;
  orient: string;
  // Pos问题
  data: Array<string>;
}
const Legend: React.FC<ILegend> = (props) => {
  const { color, orient, data } = props;
  const style = { flexDirection: orient };
  return (
    <div className={styles["legend"]} style={style as CSSProperties}>
      {data.map((label: string, index: number) => (
        <LegendItem
          key={label}
          label={label}
          fill={color[index % color.length]}
        />
      ))}
    </div>
  );
};

export default Legend;

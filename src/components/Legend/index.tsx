import { CSSProperties } from "react";
import LegendItem from "./LegendItem";
import styles from "./index.less";
import cn from "classnames";

export interface ILegend {
  color: (key: string) => string;
  orient: string;
  // Pos问题
  data: Array<string>;
  onClick: (digit2: string, state: boolean) => void;
  onMouseEnter?: (hoverName: string) => void;
  onMouseLeave?: () => void;
  itemClassName?: string;
}

const Legend: React.FC<ILegend> = (props) => {
  const {
    color,
    orient,
    data,
    onClick,
    onMouseEnter = () => {},
    onMouseLeave = () => {},
    itemClassName = "",
  } = props;
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
          itemClassName={itemClassName}
        />
      ))}
    </div>
  );
};

export default Legend;

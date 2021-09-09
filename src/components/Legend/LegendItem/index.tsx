import React from "react";
import styles from "./index.less";

export interface ILegendItem {
  label: string;
  fill: string;
  hover?: any;
  onClick: () => void;
}

const LegendItem: React.FC<ILegendItem> = (props) => {
  const { label, fill, onClick } = props;

  return (
    <div className={styles["legend_item"]} onClick={onClick}>
      <div className={styles["legend_swatch"]} style={{ background: fill }} />
      <div className={styles["legend_label"]}>{label}</div>
    </div>
  );
};

export default LegendItem;

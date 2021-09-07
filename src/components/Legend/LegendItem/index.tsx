import React from "react";
import styles from "./index.less";

export interface ILegendItem {
  label: string;
  fill: string;
  hover?: any;
  click?: any;
}

const LegendItem: React.FC<ILegendItem> = (props) => {
  const { label, fill } = props;

  return (
    <div className={styles["legend_item"]}>
      <div className={styles["legend_swatch"]} style={{ background: fill }} />
      <div className={styles["legend_label"]}>{label}</div>
    </div>
  );
};

export default LegendItem;

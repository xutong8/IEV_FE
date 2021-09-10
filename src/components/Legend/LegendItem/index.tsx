import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.less";

export interface ILegendItem {
  label: string;
  fill: string;
  hover?: any;
  onClick: (digit2: string, state: boolean) => void;
  onMouseEnter: (e: any) => void;
  onMouseLeave: (e: any) => void;
}

const LegendItem: React.FC<ILegendItem> = (props) => {
  const { label, fill, onClick, onMouseEnter, onMouseLeave } = props;
  const [selected, setSelected] = useState<boolean>(false);

  const onClickLegend = useCallback(() => {
    setSelected(!selected);
    // setSelected(selected => !selected);
    onClick(label, !selected);
  }, [selected]);

  return (
    <div
      className={styles["legend_item"]}
      onClick={onClickLegend}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={styles["legend_swatch"]}
        style={{ background: selected ? "gray" : fill }}
      />
      <div className={styles["legend_label"]}>{label}</div>
    </div>
  );
};

export default LegendItem;

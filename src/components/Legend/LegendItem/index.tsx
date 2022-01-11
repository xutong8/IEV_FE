import React, { useCallback, useState } from "react";
import styles from "./index.less";
import cn from "classnames";
export interface ILegendItem {
  label: string;
  fill: string;
  hover?: any;
  onClick: (digit2: string, state: boolean) => void;
  onMouseEnter: (hoverName: string) => void;
  onMouseLeave: () => void;
  itemClassName: string;
}

const LegendItem: React.FC<ILegendItem> = (props) => {
  const { label, fill, onClick, onMouseEnter, onMouseLeave, itemClassName } =
    props;
  const [selected, setSelected] = useState<boolean>(false);

  const onClickLegend = useCallback(() => {
    setSelected(!selected);

    onClick(label, !selected);
  }, [selected, onClick]);

  return (
    <div
      className={cn({
        [styles["legend_item"]]: true,
        [itemClassName]: true,
      })}
      onClick={onClickLegend}
      onMouseEnter={() => onMouseEnter(label)}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={styles["legend_swatch"]}
        style={{
          background: selected ? "gray" : fill,
          opacity: 0.6,
          border: `1px solid ${selected ? "gray" : fill}`,
        }}
      />
      <div className={styles["legend_label"]}>{label}</div>
    </div>
  );
};

export default LegendItem;

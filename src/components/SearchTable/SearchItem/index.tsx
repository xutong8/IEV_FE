import React from "react";
import styles from "./index.less";
import { ValueType } from "@/types";

export interface ISearchItemProps {
  year: string;
  exportCountry: string;
  importCountry: string;
  type: string;
  amount: string;
  valueType: ValueType;
}

const SearchItem: React.FC<ISearchItemProps> = (props) => {
  const {
    year,
    exportCountry,
    importCountry,
    type,
    amount,
    valueType = "text",
  } = props;

  const getAmount = () => {
    if (valueType === "text") {
      return amount;
    }

    return <div className={styles["rect"]} style={{ width: "50%" }} />;
  };

  return (
    <div className={styles["search_item"]}>
      <div className={styles["common"]}>{year}</div>
      <div className={styles["common"]}>{exportCountry}</div>
      <div className={styles["common"]}>{importCountry}</div>
      <div className={styles["common"]}>{type}</div>
      <div className={styles["common"]}>{getAmount()}</div>
    </div>
  );
};

export default SearchItem;

import ForceGraph from "@/components/ForceGraph";
import React from "react";
import styles from "./index.less";
import { connect } from "react-redux";
import { IStore } from "@/reducers";

export interface IForceGraphWithStoreProps {
  radius: number;
  year: number;
  category: string[];
}

const ForceGraphWithStore: React.FC<IForceGraphWithStoreProps> = (props) => {
  const { radius, year, category } = props;
  return (
    <ForceGraph
      width="100%"
      height="100%"
      radius={radius}
      year={year}
      category={category}
    />
  );
};

const mapStateToProps = (state: IStore) => {
  const { radius, year, categoryObj } = state;
  return {
    radius,
    year,
    category: categoryObj.selectedCategory.map((item) => item.id),
  };
};

export default connect(mapStateToProps)(ForceGraphWithStore);

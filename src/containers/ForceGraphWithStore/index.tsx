import ForceGraph from "@/components/ForceGraph";
import React from "react";
import styles from "./index.less";
import { connect } from "react-redux";
import { IStore } from "@/reducers";

export interface IForceGraphWithStoreProps {
  radius: number;
  year: number;
  category: string[];
  width: number;
  height: number;
}

const ForceGraphWithStore: React.FC<IForceGraphWithStoreProps> = (props) => {
  const { radius, year, category, width, height } = props;
  return (
    <ForceGraph
      width={width}
      height={height}
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

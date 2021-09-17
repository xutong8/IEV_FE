import ForceGraph from "@/components/ForceGraph";
import React from "react";
import styles from "./index.less";
import { connect } from "react-redux";
import { IStore } from "@/reducers";

export interface IForceGraphWithStoreProps {
  radius: number;
  year: number;
}

const ForceGraphWithStore: React.FC<IForceGraphWithStoreProps> = (props) => {
  const { radius, year } = props;
  return <ForceGraph width="100%" height="100%" radius={radius} year={year} />;
};

const mapStateToProps = (state: IStore) => {
  const { radius, year } = state;
  return {
    radius,
    year,
  };
};

export default connect(mapStateToProps)(ForceGraphWithStore);

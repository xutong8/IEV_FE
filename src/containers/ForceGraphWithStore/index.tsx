import ForceGraph from "@/components/ForceGraph";
import React from "react";
import styles from "./index.less";
import { connect } from "react-redux";
import SearchTable from "../../components/SearchTable";
import { IStore } from "@/reducers";

export interface IForceGraphWithStoreProps {
  radius: number;
}

const ForceGraphWithStore: React.FC<IForceGraphWithStoreProps> = (props) => {
  const { radius } = props;
  return <ForceGraph width="100%" height="100%" radius={radius} />;
};

const mapStateToProps = (state: IStore) => {
  const { radius } = state;
  return {
    radius,
  };
};

export default connect(mapStateToProps)(ForceGraphWithStore);

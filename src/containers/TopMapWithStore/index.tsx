import { IStore } from "@/reducers";
import React from "react";
import { connect } from "react-redux";
import TopMap from "../../components/TopMap";

export interface ITopMapWithStoreProps {
  year: number;
}

const TopMapWithStore: React.FC<ITopMapWithStoreProps> = (props) => {
  const { year } = props;
  return <TopMap year={year} />;
};

const mapStateToProps = (state: IStore) => {
  const { year } = state;
  return {
    year,
  };
};

export default connect(mapStateToProps)(TopMapWithStore);

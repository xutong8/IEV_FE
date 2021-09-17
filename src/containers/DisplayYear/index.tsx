import React from "react";
import styles from "./index.less";
import { IStore } from "@/reducers";
import { connect } from "react-redux";

interface IDisplayYearProps {
  year: number;
}

const DisplayYear: React.FC<IDisplayYearProps> = (props) => {
  const { year } = props;
  return <div>{year}</div>;
};

const mapStateToProps = (state: IStore) => {
  const { year } = state;
  return {
    year,
  };
};

export default connect(mapStateToProps)(DisplayYear);

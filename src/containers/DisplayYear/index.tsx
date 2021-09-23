import React from "react";
import styles from "./index.less";
import { IStore } from "@/reducers";
import { connect } from "react-redux";
import { Tag } from "antd";

interface IDisplayYearProps {
  year: number;
}

const DisplayYear: React.FC<IDisplayYearProps> = (props) => {
  const { year } = props;
  return (
    <div>
      <Tag>{year}</Tag>
    </div>
  );
};

const mapStateToProps = (state: IStore) => {
  const { year } = state;
  return {
    year,
  };
};

export default connect(mapStateToProps)(DisplayYear);

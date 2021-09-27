import Tags, { ITag } from "@/components/Tags";
import React from "react";
import styles from "./index.less";
import { IStore } from "@/reducers";
import { connect } from "react-redux";
import { Tag } from "antd";

export interface ICountryListProps {
  countryList: ITag[];
}

const CountryList: React.FC<ICountryListProps> = (props) => {
  const { countryList } = props;

  return (
    <div className={styles.list}>
      <Tags tags={countryList} />
    </div>
  );
};

const mapStateToProps = (state: IStore) => {
  const { countryList } = state;
  return {
    countryList,
  };
};

export default connect(mapStateToProps)(CountryList);

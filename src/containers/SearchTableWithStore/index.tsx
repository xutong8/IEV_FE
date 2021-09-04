import { IStore } from "@/reducers";
import { ValueType } from "@/types";
import React from "react";
import { connect } from "react-redux";
import SearchTable from "../../components/SearchTable";

export interface ISearchTableWithStoreProps {
  valueType: ValueType;
}

const SearchTableWithStore: React.FC<ISearchTableWithStoreProps> = (props) => {
  const { valueType } = props;
  return <SearchTable valueType={valueType} />;
};

const mapStateToProps = (state: IStore) => {
  const { valueType } = state;
  return {
    valueType,
  };
};

export default connect(mapStateToProps)(SearchTableWithStore);

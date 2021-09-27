import React from "react";
import styles from "./index.less";
import { Button, Spin } from "antd";
import { IStore } from "@/reducers";
import { connect } from "react-redux";
import { ICategoryObj } from "@/types";
import { Dispatch } from "redux";
import { replaceCategory } from "@/actions/categoryList";
import Tags from "@/components/Tags";

interface ICategoryListProps {
  categoryObj: ICategoryObj;
  replaceCategory: () => void;
}

const CategoryList: React.FC<ICategoryListProps> = (props) => {
  const { categoryObj, replaceCategory } = props;

  const handleConfirm = () => {
    replaceCategory();
  };

  return (
    <div className={styles.list}>
      <Spin spinning={categoryObj.selectedCategory.length === 0}>
        <Tags tags={categoryObj.displayedCategory} />
      </Spin>
      <Button type="primary" size="small" onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  );
};

const mapStateToProps = (state: IStore) => {
  const { categoryObj } = state;
  return {
    categoryObj,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    replaceCategory: () => {
      dispatch(replaceCategory());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);

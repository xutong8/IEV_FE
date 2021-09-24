import React from "react";
import styles from "./index.less";
import { Button, Tag, Spin } from "antd";
import { IStore } from "@/reducers";
import { connect } from "react-redux";
import { ICategoryObj } from "@/types";
import { Dispatch } from "redux";
import { replaceCategory } from "@/actions/categoryList";

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
        <div className={styles.tags}>
          {categoryObj.displayedCategory.map((category) => (
            <Tag key={category.id} style={{ margin: 2 }}>
              {category.name}
            </Tag>
          ))}
        </div>
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

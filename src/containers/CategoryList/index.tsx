import React from "react";
import styles from "./index.less";
import { Tag } from "antd";
import { IStore } from "@/reducers";
import { connect } from "react-redux";
import { ICategoryObj } from "@/types";

interface ICategoryListProps {
  categoryObj: ICategoryObj;
}

const CategoryList: React.FC<ICategoryListProps> = (props) => {
  const { categoryObj } = props;
  return (
    <div className={styles.list}>
      {categoryObj.selectedCategory.map((category) => (
        <Tag key={category.id} style={{ margin: 2 }}>
          {category.name}
        </Tag>
      ))}
    </div>
  );
};

const mapStateToProps = (state: IStore) => {
  const { categoryObj } = state;
  return {
    categoryObj,
  };
};

export default connect(mapStateToProps)(CategoryList);

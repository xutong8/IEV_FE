import React from "react";
import styles from "./index.less";
import { Tag } from "antd";

export interface ITag {
  id: string;
  name: string;
}

export interface ITagsProps {
  tags: ITag[];
}

const Tags: React.FC<ITagsProps> = (props) => {
  const { tags } = props;

  return (
    <div className={styles.tags}>
      {tags.length !== 0 ? (
        tags.map((tag) => (
          <Tag key={tag.id} className={styles.tag}>
            {tag.name}
          </Tag>
        ))
      ) : (
        <Tag className={styles.tag}>None</Tag>
      )}
    </div>
  );
};

export default Tags;

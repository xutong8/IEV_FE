import React from "react";
import styles from "./index.less";

export interface ITitleProps {
  title: string;
}

const Title: React.FC<ITitleProps> = (props) => {
  const { title } = props;
  return <div className={styles.title}>{title}</div>;
};

export default Title;

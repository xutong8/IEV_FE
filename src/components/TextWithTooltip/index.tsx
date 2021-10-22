import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { CSSProperties } from "react";
import styles from "./index.less";

export interface ITextWithTooltip {
  title: string;
  style?: CSSProperties;
}

const TextWithTooltip: React.FC<ITextWithTooltip> = (props) => {
  const { title, style } = props;

  return (
    <div className={styles.textDiv} style={{ ...style }}>
      <div className={styles.title}>{title}</div>
      {title.length > 12 ? (
        <Tooltip title={title}>
          <QuestionCircleOutlined />
        </Tooltip>
      ) : null}
    </div>
  );
};

export default TextWithTooltip;

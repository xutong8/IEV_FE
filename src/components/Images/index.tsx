import { CSSProperties } from "react";
import ImageItem, { Image } from "./ImageItem";
import styles from "./index.less";

export interface IImagesProps {
  imageList: Array<Image>;
  column: number;
  bordered?: boolean;
  imgStyle?: CSSProperties;
  style?: CSSProperties;
}

const Images: React.FC<IImagesProps> = (props) => {
  const {
    imageList,
    column,
    bordered = false,
    imgStyle = {},
    style = {},
  } = props;

  // 左右margin各为4px
  const innerStyle = column
    ? {
        width: `calc(${100 / column}% - 8px)`,
      }
    : {};

  return (
    <div className={styles["image_list"]}>
      {imageList.map((item: any, index: number) => (
        <ImageItem
          key={index}
          imageObj={item}
          style={{ ...style, ...innerStyle }}
          bordered={bordered}
          imgStyle={imgStyle}
        />
      ))}
    </div>
  );
};

export default Images;

import { CSSProperties } from "react";
import styles from "./index.less";
import cn from "classnames";
import { Tooltip } from "antd";
export interface IImageItem {
  imageObj: Image;
  style: CSSProperties;
  bordered?: boolean;
  imgStyle?: CSSProperties;
  onClick?: (image: Image) => void;
}

export interface Image {
  name?: string;
  id?: string;
  image: string;
}

const ImageItem: React.FC<IImageItem> = (props) => {
  const { imageObj, style, bordered = false, imgStyle = {}, onClick } = props;
  const { name = "", image } = imageObj;
  return (
    <div
      className={cn({
        [styles["image_item"]]: true,
        [styles["bordered"]]: bordered,
      })}
      key={name}
      style={style}
      onClick={() => onClick?.(imageObj)}
    >
      <Tooltip title={name}>
        <img
          className={styles["image"]}
          src={`${image}`}
          alt={name}
          style={imgStyle}
        />
      </Tooltip>
    </div>
  );
};

export default ImageItem;

import { CSSProperties } from "react";
import styles from "./index.less";
import cn from "classnames";
export interface IImageItem {
  image: Image;
  style: CSSProperties;
  bordered?: boolean;
  imgStyle?: CSSProperties;
}

export interface Image {
  name?: string;
  key?: string;
  img: string;
}

const ImageItem: React.FC<IImageItem> = (props) => {
  const { image, style, bordered = false, imgStyle = {} } = props;
  const { name = "", img } = image;
  return (
    <div
      className={cn({
        [styles["image_item"]]: true,
        [styles["bordered"]]: bordered,
      })}
      key={name}
      style={style}
    >
      <img className={styles["image"]} src={img} alt={name} style={imgStyle} />
      <div className={styles["image_name"]}>{name}</div>
    </div>
  );
};

export default ImageItem;

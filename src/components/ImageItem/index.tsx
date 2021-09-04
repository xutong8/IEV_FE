import { CSSProperties } from "react";
import styles from "./index.less";

export interface IImageItem {
  image: Image;
  style: CSSProperties;
  size: number;
}

export interface Image {
  name?: string;
  key?: string;
  img: string;
}

const ImageItem: React.FC<IImageItem> = (props) => {
  const { image, style, size } = props;
  const { name, img } = image;
  return (
    <div className={styles["image_item"]} key={name} style={style}>
      <img
        className={styles["image"]}
        src={img}
        alt={name}
        style={{ width: size }}
      />
      <div className={styles["image_name"]}>{name}</div>
    </div>
  );
};

export default ImageItem;

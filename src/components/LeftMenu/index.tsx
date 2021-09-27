import ValueTypeButton from "@/containers/ValueTypeButton";
import styles from "./index.less";
import { Tag } from "antd";
import DisplayYear from "@/containers/DisplayYear";
import RadiusSlider from "@/containers/RadiusSlider";
import CategoryList from "@/containers/CategoryList";
import CountryList from "@/containers/CountryList";

const LeftMenu = () => {
  return (
    <div className={styles.leftmenu}>
      <div className={styles.basic}>
        <Tag color="geekblue" className={styles.text}>
          Amount Column:
        </Tag>
        <ValueTypeButton />
      </div>
      <div className={styles.basic}>
        <Tag color="geekblue" className={styles.text}>
          Current Year:
        </Tag>
        <DisplayYear />
      </div>
      <div className={styles.basic}>
        <Tag color="geekblue" className={styles.text} style={{ height: 32 }}>
          Current Countries:
        </Tag>
        <CountryList />
      </div>
      <div className={styles.basic}>
        <Tag color="geekblue" className={styles.text} style={{ height: 32 }}>
          Current Categories:
        </Tag>
        <CategoryList />
      </div>
      <div className={styles.basic}>
        <Tag color="geekblue" className={styles.text}>
          Force Node Radius:
        </Tag>
        <RadiusSlider />
      </div>
    </div>
  );
};

export default LeftMenu;

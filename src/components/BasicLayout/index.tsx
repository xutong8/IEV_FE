import React from "react";
import SearchTableWithStore from "@/containers/SearchTableWithStore";
import LeftMenu from "../LeftMenu";
import styles from "./index.less";
import ForceGraph from "../ForceGraph";
import ImagesDisplay from "../ImagesDisplay";
import { Nations, icons } from "../../assets/images";
import StackChart from "../StackChart";

const BasicLayout = () => {
  return (
    <div className={styles["basic_layout"]}>
      <div className={styles["left_menu"]}>
        <LeftMenu />
      </div>
      <div className={styles["main_content"]}>
        <div className={styles["top"]}>top</div>
        <div className={styles["middle"]}>
          <div className={styles["item"]}>
            <ImagesDisplay imageList={Nations} column={5} size={20} />
          </div>
          <div className={styles["item"]}>
            <ImagesDisplay imageList={icons} column={5} size={30} />
          </div>
        </div>
        <div className={styles["bottom"]}>
          {/* <ForceGraph width={400} height={400} /> */}
          <StackChart width={600} height={400} />
        </div>
      </div>
      <div className={styles["right_menu"]}>
        <SearchTableWithStore />
      </div>
    </div>
  );
};

export default BasicLayout;

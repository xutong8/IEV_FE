import SearchTableWithStore from "@/containers/SearchTableWithStore";
import LeftMenu from "../LeftMenu";
import styles from "./index.less";
import ForceGraph from "../ForceGraph";

import Images from "../Images";
import { Nations, icons } from "../../assets/images";
import StackChart from "../StackChart";
import ProgressBar from "../ProgressBar";
import TopMap from "../TopMap";
import PieMap from "../PieMap";

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
            <Images
              imageList={Nations}
              column={7}
              bordered={true}
              imgStyle={{
                width: 36,
                height: 24,
              }}
            />
          </div>
          <div className={styles["item"]}>
            <Images
              imageList={icons}
              column={5}
              imgStyle={{ boxShadow: "none", width: "30%" }}
              style={{
                boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.1)",
                borderRadius: 4,
                marginTop: 10,
              }}
            />
          </div>
        </div>
        <div className={styles["bottom"]}>
          <div className={styles.first}>
            <div className={styles.firstLeft}>
              <div className={styles.topMap}>
                <TopMap year="1995" />
              </div>
            </div>
            <div className={styles.firstRight}>
              <div className={styles.force}>
                <ForceGraph width="100%" height="100%" />
              </div>
            </div>
          </div>
          <div className={styles.second}>
            <div className={styles.secondLeft}>
              <div className={styles.pieMapContainer}>
                <PieMap />
              </div>
            </div>
            <div className={styles.secondRight}>
              <div className={styles.stack}>
                <StackChart width="100%" height="100%" />
              </div>
            </div>
          </div>
          <div className={styles.progress}>
            <ProgressBar width="100%" height="100%" />
          </div>
        </div>
      </div>
      <div className={styles["right_menu"]}>
        <SearchTableWithStore />
      </div>
    </div>
  );
};

export default BasicLayout;

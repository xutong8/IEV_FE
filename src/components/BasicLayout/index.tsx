import SearchTableWithStore from "@/containers/SearchTableWithStore";
import LeftMenu from "../LeftMenu";
import styles from "./index.less";
import StackChart from "../StackChart";
import ProgressBar from "../ProgressBar";
import PieMap from "../PieMap";
import { useRef, useState } from "react";
import { useSVGSize } from "@/hooks/useSVGSize";
import ForceGraphWithStore from "@/containers/ForceGraphWithStore";
import TopMapWithStore from "@/containers/TopMapWithStore";
import Title from "../Title";

const BasicLayout = () => {
  // stack container的ref
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const [stackWidth, stackHeight] = useSVGSize(stackContainerRef);

  // 对比国家
  const [sourceCountry, setSourceCountry] = useState<string>("China");
  // 参照国家
  const [targetCountry, setTargetCountry] = useState<string>("USA");

  // force graph的ref
  const forceGraphRef = useRef<HTMLDivElement>(null);
  const [forceWidth, forceHeight] = useSVGSize(forceGraphRef);

  return (
    <div className={styles["basic_layout"]}>
      <div className={styles["left_menu"]}>
        <LeftMenu />
      </div>
      <div className={styles["main_content"]}>
        <div className={styles["bottom"]}>
          <div className={styles.first}>
            <div className={styles.firstLeft}>
              <div className={styles.topMap}>
                <TopMapWithStore />
              </div>
            </div>
            <div className={styles.firstRight}>
              <div className={styles.force} ref={forceGraphRef}>
                <ForceGraphWithStore width={forceWidth} height={forceHeight} />
              </div>
            </div>
          </div>
          <div className={styles.second}>
            <div className={styles.secondLeft}>
              <div className={styles.pieMapContainer}>
                <PieMap
                  sourceCountry={sourceCountry}
                  setSourceCountry={setSourceCountry}
                  targetCountry={targetCountry}
                  setTargetCountry={setTargetCountry}
                />
              </div>
            </div>
            <div className={styles.secondRight}>
              <div className={styles.stack} ref={stackContainerRef}>
                <StackChart width={stackWidth} height={stackHeight} />
              </div>
            </div>
          </div>
          <div className={styles.progress}>
            <Title title="Progress View"></Title>
            <div className={styles.content}>
              <ProgressBar
                width="100%"
                height="100%"
                sourceCountry={sourceCountry}
                targetCountry={targetCountry}
              />
            </div>
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

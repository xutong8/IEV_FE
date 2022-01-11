import SearchTableWithStore from "@/containers/SearchTableWithStore";
import LeftMenu from "../LeftMenu";
import styles from "./index.less";
import StackChart from "../StackChart";
import ProgressBar from "../ProgressBar";
import PieMap from "../ContrastView";
import { useRef, useState } from "react";
import { useSVGSize } from "@/hooks/useSVGSize";
import ForceGraphWithStore from "@/containers/ForceGraphWithStore";
import TopMapWithStore from "@/containers/TopMapWithStore";
import Title from "../Title";
import { addCountryItem, delCountryItem } from "@/actions/countryList";
import RadarArea from "../RadarArea";
import { Button } from "antd";
import {
  PlayCircleTwoTone,
  PauseCircleTwoTone,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { IconState } from "@/constants";
import { useDispatch } from "react-redux";
import { addOneYear } from "@/actions/year";
import { max_year, min_year } from "@/constants/year";
import { header } from "@/assets/images";

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

  // progressRef
  const progressRef = useRef<HTMLDivElement>(null);
  const [progressWidth, progressHeight] = useSVGSize(progressRef);

  // 保存按钮的状态，用于展示播放/暂停
  const [iconState, setIconState] = useState<IconState>(IconState.PLAY);

  // 保存是否排序的按钮状态
  const [sorted, setSorted] = useState<boolean>(false);

  // dispatch
  const dispatch = useDispatch();

  // year selector
  const yearRef = useRef<number>(min_year);

  // timer ref
  const timerRef = useRef<any>(null);

  return (
    <>
      <div
        className={styles["header"]}
        style={{ backgroundImage: `url(${header})` }}
      />
      <div className={styles["basic_layout"]}>
        <div className={styles["left_content"]}>
          <LeftMenu />
          <div className={styles["radar_chart"]}>
            <Title title="Country/Region List"></Title>
            <RadarArea />
          </div>
        </div>
        <div className={styles["main_content"]}>
          <div className={styles["bottom"]}>
            <div className={styles["container"]}>
              <div className={styles["chart_content"]}>
                <div className={styles.first}>
                  <div className={styles.firstLeft}>
                    <div className={styles.topMap}>
                      <TopMapWithStore />
                    </div>
                  </div>
                  <div className={styles.firstRight}>
                    <div className={styles.force} ref={forceGraphRef}>
                      <ForceGraphWithStore
                        width={forceWidth}
                        height={forceHeight}
                      />
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
              </div>
            </div>
            <div className={styles.progress}>
              <Title title="Timeline"></Title>
              <div className={styles.main}>
                <div className={styles.playBtn}>
                  <Button
                    type="default"
                    icon={
                      iconState === IconState.PLAY ? (
                        <PlayCircleTwoTone />
                      ) : (
                        <PauseCircleTwoTone />
                      )
                    }
                    onClick={() => {
                      if (iconState === IconState.PLAY) {
                        timerRef.current = setInterval(() => {
                          if (yearRef.current >= max_year) {
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                            return;
                          }
                          yearRef.current = yearRef.current + 1;
                          dispatch(addOneYear());
                        }, 5000);
                      } else {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                      }
                      setIconState((prev) =>
                        prev === IconState.PLAY
                          ? IconState.PAUSE
                          : IconState.PLAY
                      );
                    }}
                  />
                </div>
                <div className={`${styles.sortBtn}`}>
                  <Button
                    className={sorted ? styles.sorted : ""}
                    onClick={() => setSorted(!sorted)}
                    icon={<SortAscendingOutlined />}
                  />
                </div>
                <div className={styles.progressContent} ref={progressRef}>
                  <ProgressBar
                    width={progressWidth}
                    height={progressHeight}
                    sourceCountry={sourceCountry}
                    targetCountry={targetCountry}
                    sorted={sorted}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles["right_menu"]}>
          <SearchTableWithStore />
        </div>
      </div>
    </>
  );
};

export default BasicLayout;

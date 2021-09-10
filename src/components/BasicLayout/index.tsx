import SearchTableWithStore from "@/containers/SearchTableWithStore";
import LeftMenu from "../LeftMenu";
import styles from "./index.less";
import ForceGraph from "../ForceGraph";
import Pie from "../Pie";
import Images from "../Images";
import { Nations, icons } from "../../assets/images";
import StackChart from "../StackChart";
import CountryMap from "../CountryMap";
import { Select } from "antd";
import { useContext, useState } from "react";
import { projectContext } from "@/context/projectData";
import cn from "classnames";
import ProgressBar from "../ProgressBar";
import TopMap from "../TopMap";

const { Option } = Select;

const BasicLayout = () => {
  const productData = useContext(projectContext);
  // 对比国家
  const [sourceCountry, setSourceCountry] = useState<string>("China");
  // 参照国家
  const [targetCountry, setTargetCountry] = useState<string>("Usa");

  return (
    <div className={styles["basic_layout"]}>
      <div className={styles["left_menu"]}>
        <LeftMenu />
      </div>
      <div className={styles["main_content"]}>
        <div className={styles["top"]}>top</div>
        <div className={styles["middle"]}>
          <div className={styles["item"]}>
            <Images imageList={Nations} column={5} size={20} />
          </div>
          <div className={styles["item"]}>
            <Images imageList={icons} column={5} size={30} />
          </div>
        </div>
        <div className={styles["bottom"]}>
          <div style={{ flex: "1 0 0", display: "flex" }}>
            <div className={styles.left}>
              <div className={styles.topMap}>
                <TopMap />
              </div>
              <div className={styles.bottomMap}>
                <div className={styles.maps}>
                  <div
                    className={cn({
                      [styles.sourceMap]: true,
                      [styles.basicMap]: true,
                    })}
                  >
                    <CountryMap
                      name={sourceCountry}
                      style={{ transform: "translate(0, 10%)" }}
                    />
                    <Select
                      className={styles.select}
                      value={sourceCountry}
                      onChange={(country: string) => setSourceCountry(country)}
                    >
                      {(productData?.countris ?? [])
                        .filter((name) => name !== targetCountry)
                        .map((name) => (
                          <Option key={name} value={name}>
                            {name}
                          </Option>
                        ))}
                    </Select>
                  </div>
                  <div className={styles.middleMap}>
                    <Pie width={320} height={200} />
                    <CountryMap
                      name="World"
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                  <div
                    className={cn({
                      [styles.targetMap]: true,
                      [styles.basicMap]: true,
                    })}
                  >
                    <CountryMap
                      name={targetCountry}
                      style={{ transform: "translate(0, 10%)" }}
                    />
                    <Select
                      className={styles.select}
                      value={targetCountry}
                      onChange={(country: string) => setTargetCountry(country)}
                    >
                      {(productData?.countris ?? [])
                        .filter((name) => name !== sourceCountry)
                        .map((name) => (
                          <Option key={name} value={name}>
                            {name}
                          </Option>
                        ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.force}>
                <ForceGraph width="100%" height="100%" />
              </div>
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

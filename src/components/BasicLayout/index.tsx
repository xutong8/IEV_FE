import SearchTableWithStore from "@/containers/SearchTableWithStore";
import LeftMenu from "../LeftMenu";
import styles from "./index.less";
import ForceGraph from "../ForceGraph";
import ImagesDisplay from "../ImagesDisplay";
import { Nations, icons } from "../../assets/images";
import StackChart from "../StackChart";
import CountryMap from "../CountryMap";
import { Select } from "antd";
import { useContext, useState } from "react";
import { projectContext } from "@/context/projectData";
import cn from "classnames";
import ProgressBar from "../ProgressBar";

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
            <ImagesDisplay imageList={Nations} column={5} size={20} />
          </div>
          <div className={styles["item"]}>
            <ImagesDisplay imageList={icons} column={5} size={30} />
          </div>
        </div>
        <div className={styles["bottom"]}>
          <div className={styles.left}>
            <div className={styles.topMap}>
              {/* <CountryMap name="china" /> */}
            </div>
            <div className={styles.bottomMap}>
              <div className={styles.maps}>
                <div
                  className={cn({
                    [styles.sourceMap]: true,
                    [styles.basicMap]: true,
                  })}
                >
                  <CountryMap name={sourceCountry} />
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
                  {/* <CountryMap name="china" /> */}
                </div>
                <div
                  className={cn({
                    [styles.targetMap]: true,
                    [styles.basicMap]: true,
                  })}
                >
                  <CountryMap name={targetCountry} />
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
              <div className={styles.progress}>
                <ProgressBar width={674} height={156} />
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.force}>
              <ForceGraph width={460} height={337} />
            </div>
            <div className={styles.stack}>
              <StackChart width={460} height={337} />
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

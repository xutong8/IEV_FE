import { useContext, useState } from "react";
import Pie from "../Pie";
import styles from "./index.less";
import cn from "classnames";
import CountryMap from "../CountryMap";
import { Select } from "antd";
import { projectContext } from "@/context/projectData";
import Choropleth from "../Choropleth";
import { data } from "@/utils/processChoroplethData";

const { Option } = Select;

const PieMap = () => {
  const productData = useContext(projectContext);
  // 对比国家
  const [sourceCountry, setSourceCountry] = useState<string>("China");
  // 参照国家
  const [targetCountry, setTargetCountry] = useState<string>("Usa");

  return (
    <div className={styles.pieMap}>
      <div className={styles.maps}>
        <div
          className={cn({
            [styles.sourceMap]: true,
            [styles.basicMap]: true,
          })}
        >
          <CountryMap
            className={styles.sourceCountryMap}
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
          <Pie width="100%" height="100%" />
          <Choropleth
            data={data}
            selectedCountries={["156", "842"]}
            selectedColors={["red", "blue"]}
            parentClass={styles.middleMap}
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
            className={styles.targetCountryMap}
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
  );
};

export default PieMap;

import { useContext, useRef, useState } from "react";
import Pie from "../Pie";
import styles from "./index.less";
import cn from "classnames";
import CountryMap from "../CountryMap";
import { Select } from "antd";
import { projectContext } from "@/context/projectData";
import Choropleth from "../Choropleth";
import { useSVGSize } from "@/hooks/useSVGSize";

const { Option } = Select;

const PieMap = () => {
  const productData = useContext(projectContext);
  // 对比国家
  const [sourceCountry, setSourceCountry] = useState<string>("China");
  // 参照国家
  const [targetCountry, setTargetCountry] = useState<string>("Usa");
  // source map的ref
  const sourceMapRef = useRef<HTMLDivElement>(null);
  const [sourceMapWidth, sourceMapHeight] = useSVGSize(sourceMapRef);
  // middle map的ref
  const middleMapRef = useRef<HTMLDivElement>(null);
  const [middleMapWidth, middleMapHeight] = useSVGSize(middleMapRef);
  // target map的ref
  const targetMapRef = useRef<HTMLDivElement>(null);
  const [targetMapWidth, targetMapHeight] = useSVGSize(targetMapRef);

  return (
    <div className={styles.pieMap}>
      <div className={styles.maps}>
        <div
          className={cn({
            [styles.sourceMap]: true,
            [styles.basicMap]: true,
          })}
          ref={sourceMapRef}
        >
          <CountryMap
            className={styles.sourceCountryMap}
            name={sourceCountry}
            style={{
              width: sourceMapWidth,
              height: sourceMapHeight - 60,
              overflow: "auto",
            }}
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
        <div className={styles.middleMap} ref={middleMapRef}>
          <Pie width={middleMapWidth} height={middleMapHeight} />
          <Choropleth
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
          ref={targetMapRef}
        >
          <CountryMap
            name={targetCountry}
            className={styles.targetCountryMap}
            style={{
              width: targetMapWidth,
              height: sourceMapHeight - 60,
              overflow: "auto",
            }}
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

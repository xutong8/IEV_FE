import { useContext, useRef, useState } from "react";
import Pie from "../Pie";
import styles from "./index.less";
import cn from "classnames";
import CountryMap from "../CountryMap";
import { Select, Spin } from "antd";
import { projectContext } from "@/context/projectData";
import Choropleth from "../Choropleth";
import { useSVGSize } from "@/hooks/useSVGSize";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";
import Title from "../Title";
import RadarChart from "../RadarChart";

const { Option } = Select;

export interface IPieMapProps {
  sourceCountry: string;
  targetCountry: string;
  setSourceCountry: (sourceCountry: string) => void;
  setTargetCountry: (targetCountry: string) => void;
}

const PieMap: React.FC<IPieMapProps> = (props) => {
  const productData = useContext(projectContext);

  const { sourceCountry, targetCountry, setSourceCountry, setTargetCountry } =
    props;

  // source map的ref
  const sourceMapRef = useRef<HTMLDivElement>(null);
  const [sourceMapWidth, sourceMapHeight] = useSVGSize(sourceMapRef);
  // middle map的ref
  const middleMapRef = useRef<HTMLDivElement>(null);
  const [middleMapWidth, middleMapHeight] = useSVGSize(middleMapRef);
  // target map的ref
  const targetMapRef = useRef<HTMLDivElement>(null);
  const [targetMapWidth] = useSVGSize(targetMapRef);

  // category selector
  const category = useSelector(
    (state: IStore) =>
      state.categoryObj.selectedCategory.map((item) => item.name),
    (prev, next) => isEqual(prev, next)
  );

  return (
    <div className={styles.pieMap}>
      <Title title="PieMap View"></Title>
      <div className={styles.maps}>
        <div
          className={cn({
            [styles.sourceMap]: true,
            [styles.basicMap]: true,
          })}
          ref={sourceMapRef}
        >
          {/* <CountryMap
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
          </Select> */}
          <RadarChart title="China" />
        </div>
        <div className={styles.middleMap} ref={middleMapRef}>
          <Spin spinning={category.length === 0} wrapperClassName={styles.spin}>
            <Pie
              width={middleMapWidth}
              height={middleMapHeight}
              sourceCountry={sourceCountry}
              targetCountry={targetCountry}
            />
            <Choropleth
              selectedCountries={["156", "842"]}
              parentClass={styles.middleMap}
            />
          </Spin>
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

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
import { findCountryIdByName } from "@/utils/findCountryIdByName";

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
      <Title title="Contrast View"></Title>
      <div className={styles.maps}>
        <div
          className={cn({
            [styles.sourceMap]: true,
            [styles.basicMap]: true,
          })}
          ref={sourceMapRef}
        >
          <div className={styles.placeholder} />
          <div className={styles.chart}>
            <RadarChart
              title={sourceCountry}
              draggable={false}
              fontSize={25}
              style={{ flex: "1 0 0" }}
              color="red"
              solveDrop={setSourceCountry}
              parentRef={sourceMapRef}
            />
          </div>
          <div className={styles.placeholder} />
        </div>
        <div className={styles.middleMap} ref={middleMapRef}>
          <Spin
            spinning={category.length === 0}
            wrapperClassName={styles.spin}
            style={{ height: "100%" }}
          >
            {/* <Pie
              width={middleMapWidth}
              height={middleMapHeight}
              sourceCountry={sourceCountry}
              targetCountry={targetCountry}
            /> */}
            <Choropleth
              selectedCountries={[
                findCountryIdByName(sourceCountry),
                findCountryIdByName(targetCountry),
              ]}
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
          <div className={styles.placeholder} />
          <div className={styles.chart}>
            <RadarChart
              title={targetCountry}
              draggable={false}
              fontSize={25}
              color="blue"
              style={{ flex: "1 0 0" }}
              parentRef={targetMapRef}
              solveDrop={setTargetCountry}
            />
          </div>
          <div className={styles.placeholder} />
        </div>
      </div>
    </div>
  );
};

export default PieMap;

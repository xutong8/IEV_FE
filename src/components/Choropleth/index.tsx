import React, { useEffect, useMemo, useRef, useState } from "react";
import { select } from "d3-selection";
import CountryMap from "../CountryMap";
import styles from "./index.less";
import { reqChoroplethMapData, reqCountryData } from "@/services/api";
import { isEqual } from "lodash";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";
import { scaleLinear } from "d3-scale";
import { colorDomain, colorRange } from "@/constants/colorScale";
import { useSVGSize } from "@/hooks/useSVGSize";
export interface IChoropleth {
  selectedCountries: Array<string>;
  parentClass: string;
}

const Choropleth: React.FC<IChoropleth> = (props) => {
  const { selectedCountries, parentClass } = props;

  const { year, category } = useSelector(
    (state: IStore) => ({
      year: state.year,
      category: state.categoryObj.selectedCategory.map((item) => item.id),
    }),
    (prev, next) => isEqual(prev, next)
  );

  const colorScale = useMemo(
    () => scaleLinear<string>().domain(colorDomain).range(colorRange),
    []
  );

  const allCountriesRef = useRef<any>();
  const choroplethRef = useRef<HTMLDivElement>(null);
  const [choroplethWidth, choroplethHeight] = useSVGSize(choroplethRef);
  console.log("choropleth", choroplethHeight, choroplethWidth);

  const handleData = async () => {
    // 如果category长度为0，则跳过
    if (category.length === 0) return;

    const res: any = await reqChoroplethMapData({
      year,
      category,
      countries: selectedCountries,
    });
    const data = res.data;

    const reqAllCountries: any = await reqCountryData();
    const allCountries = reqAllCountries.data;

    Object.keys(data).forEach((id) => {
      // 过滤掉Asia经济体
      if (id === "490") {
        return;
      }

      const curDigit2 = allCountries[id]["iso_2digit_alpha"];

      select(`.${parentClass} #${curDigit2}`)
        .style(
          "fill",
          // `${colorScale(data[id])}`
          `${data[id] > 0 ? "#BE1E2E" : "#1653A1"}`
        )
        .style("fill-opacity", Math.abs(data[id]));
    });

    const selectedPair = [
      allCountries[selectedCountries[0]]["iso_2digit_alpha"],
      allCountries[selectedCountries[1]]["iso_2digit_alpha"],
    ];
    // draw color for selected country
    select(`.${parentClass} #${selectedPair[0]}`).classed(
      `${styles.shadow1} ${styles.shadow2}`,
      true
    );

    select(`.${parentClass} #${selectedPair[1]}`).classed(
      `${styles.shadow1} ${styles.shadow2}`,
      true
    );

    allCountriesRef.current = allCountries;
  };

  useEffect(() => {
    handleData();
    // 清理上一轮selectedCountry的drop-shadow
    return function cleanup() {
      const allCountries = allCountriesRef.current;
      if (!allCountries) return;

      const selectedPair = [
        allCountries[selectedCountries[0]]["iso_2digit_alpha"],
        allCountries[selectedCountries[1]]["iso_2digit_alpha"],
      ];
      // draw color for selected country
      select(`.${parentClass} #${selectedPair[0]}`).classed(
        `${styles.shadow1} ${styles.shadow2}`,
        false
      );

      select(`.${parentClass} #${selectedPair[1]}`).classed(
        `${styles.shadow1} ${styles.shadow2}`,
        false
      );
    };
  }, [selectedCountries, year, category, allCountriesRef.current]);

  return (
    <div className={styles["choropleth_container"]} ref={choroplethRef}>
      <CountryMap
        name="World"
        className={styles.map}
        style={{
          width: choroplethWidth,
          height: Math.min(choroplethWidth / 1.5, choroplethHeight), // 为了控制居中
        }}
      />
      <div className={styles.colorScale}>
        <div
          style={{
            flex: "1 0 0",
            backgroundImage: "linear-gradient(to right, #1653A1, #fff)",
          }}
          className={styles.left}
        ></div>
        <div
          style={{
            flex: "1 0 0",
            backgroundImage: "linear-gradient(to right, #fff, #BE1E2E)",
          }}
          className={styles.right}
        ></div>
      </div>
    </div>
  );
};

export default React.memo(Choropleth, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
);

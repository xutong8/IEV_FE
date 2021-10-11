import React, { useEffect, useMemo } from "react";
import { select } from "d3-selection";
import CountryMap from "../CountryMap";
import styles from "./index.less";
import { reqChoroplethMapData, reqCountryData } from "@/services/api";
import { isEqual } from "lodash";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";
import { scaleLinear } from "d3-scale";
import { colorDomain, colorRange } from "@/constants/colorScale";
import { selectAll } from "d3";
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

      const curDigit2 = allCountries[id]["iso_2digit_alpha"].toLowerCase();

      select(`.${parentClass} #${curDigit2}`).style(
        "fill",
        `${colorScale(data[id])}`
      );
    });
    const selectedPair = [
      allCountries[selectedCountries[0]]["iso_2digit_alpha"],
      allCountries[selectedCountries[1]]["iso_2digit_alpha"],
    ];
    // draw color for selected country
    select(`.${parentClass} #${selectedPair[0].toLowerCase()}`).style(
      "fill",
      `${"lightgreen"}`
    );
    // .append("text")
    // .append("textPath")
    // .attr(
    //   "xlink:href",
    //   `#${allCountries[selectedCountries[0]][
    //     "iso_2digit_alpha"
    //   ].toLowerCase()}`
    // )
    // .text(allCountries[selectedCountries[0]]["iso_2digit_alpha"]);

    select(`.${parentClass} #${selectedPair[1].toLowerCase()}`).style(
      "fill",
      `${"lightgreen"}`
    );
  };

  useEffect(() => {
    handleData();
  }, [selectedCountries, year, category]);

  return (
    <div className={styles["choropleth_container"]}>
      <CountryMap
        name="World"
        className={styles.map}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div className={styles.colorScale}>
        <div
          style={{
            flex: "1 0 0",
            backgroundImage: "linear-gradient(to right, blue, #fff)",
          }}
          className={styles.left}
        ></div>
        <div
          style={{
            flex: "1 0 0",
            backgroundImage: "linear-gradient(to right, #fff, red)",
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

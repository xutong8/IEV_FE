import React, { useEffect } from "react";
import { select } from "d3-selection";
import { iDToNameMap, nameToDigit2TotalMap } from "@/utils/processCountriesMap";
import CountryMap from "../CountryMap";
import styles from "./index.less";
import { reqChoroplethMapData, reqCountryData } from "@/services/api";
import { isEqual } from "lodash";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";
import { Spin } from "antd";
export interface IChoropleth {
  selectedCountries: Array<string>;
  selectedColors: Array<string>;
  parentClass: string;
}

// TODO: 统一数据输入; 解决列表中国家的处理
const Choropleth: React.FC<IChoropleth> = (props) => {
  const { selectedCountries, selectedColors, parentClass } = props;

  const { year, category } = useSelector(
    (state: IStore) => ({
      year: state.year,
      category: state.categoryObj.selectedCategory.map((item) => item.id),
    }),
    (prev, next) => isEqual(prev, next)
  );

  // req data
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
      const fullName = iDToNameMap.get(id);
      const curDigit2 = nameToDigit2TotalMap.get(fullName)?.toLowerCase() ?? "";
      const impCountry = Object.keys(data[id])[0];
      if (curDigit2 !== "" && curDigit2 !== "n/a") {
        select(`.${parentClass} #${curDigit2}`)
          .attr(
            "fill",
            `${selectedColors[selectedCountries.indexOf(impCountry)]}`
          )
          .attr("opacity", data[id][impCountry] / 2 + 0.5);
      }
    });

    Object.keys(data).forEach((id) => {
      // 过滤掉Asia经济体
      if (id === "490") {
        return;
      }

      const curDigit2 = allCountries[id]["iso_2digit_alpha"].toLowerCase();

      select(`.${parentClass} #${curDigit2}`)
        .style("fill", `${selectedColors[data[id] > 0 ? 0 : 1]}`)
        .attr("opacity", Math.abs(data[id]));
    });

    // draw color for selected country
    select(
      `.${parentClass} #${allCountries[selectedCountries[0]][
        "iso_2digit_alpha"
      ].toLowerCase()}`
    ).style("fill", `${selectedColors[0]}`);

    select(
      `.${parentClass} #${allCountries[selectedCountries[1]][
        "iso_2digit_alpha"
      ].toLowerCase()}`
    ).style("fill", `${selectedColors[1]}`);
  };

  useEffect(() => {
    handleData();
  }, [selectedCountries, selectedColors, year, category]);

  return (
    <CountryMap
      name="World"
      className={styles.map}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "60%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default React.memo(Choropleth, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
);

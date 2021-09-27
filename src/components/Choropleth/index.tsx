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
export interface IChoropleth {
  selectedCountries: Array<string>;
  parentClass: string;
}

// TODO: 统一数据输入; 解决列表中国家的处理
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

    // draw color for selected country
    select(
      `.${parentClass} #${allCountries[selectedCountries[0]][
        "iso_2digit_alpha"
      ].toLowerCase()}`
    ).style("fill", `${colorRange[1]}`);

    select(
      `.${parentClass} #${allCountries[selectedCountries[1]][
        "iso_2digit_alpha"
      ].toLowerCase()}`
    ).style("fill", `${colorRange[0]}`);
  };

  useEffect(() => {
    handleData();
  }, [selectedCountries, year, category]);

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

import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { iDToNameMap, nameToDigit2TotalMap } from "@/utils/processCountriesMap";
import CountryMap from "../CountryMap";
import styles from "./index.less";
import { reqChoroplethMapData } from "@/services/api";

export interface IChoropleth {
  selectedCountries: Array<string>;
  selectedColors: Array<string>;
  parentClass: string;
}

// TODO: 统一数据输入; 解决列表中国家的处理
const Choropleth: React.FC<IChoropleth> = (props) => {
  const { selectedCountries, selectedColors, parentClass } = props;

  // req data
  const handleData = async () => {
    const res: any = await reqChoroplethMapData({
      year: "2019",
      category: ["1", "2", "3"],
      countries: selectedCountries,
    });
    const data = res.data;

    // TODO: map data
    // calc color for each nation
    Object.keys(data).forEach((id) => {
      const fullName = iDToNameMap.get(id);
      let curDigit2;
      try {
        curDigit2 = nameToDigit2TotalMap.get(fullName).toLowerCase();
      } catch {
        console.log(fullName);
      }
      const impCountry = Object.keys(data[id])[0];

      try {
        select(`.${parentClass} #${curDigit2}`)
          .attr(
            "fill",
            `${selectedColors[selectedCountries.indexOf(impCountry)]}`
          )
          .attr("opacity", data[id][impCountry] / 2 + 0.5);
      } catch {
        console.log(fullName);
        return;
      }
    });
  };

  useEffect(() => {
    handleData();
  }, [selectedCountries, selectedColors]);

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

export default Choropleth;

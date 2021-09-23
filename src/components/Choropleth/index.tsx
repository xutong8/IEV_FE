import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { iDToNameMap, nameToDigit2TotalMap } from "@/utils/processCountriesMap";
import CountryMap from "../CountryMap";
import styles from "./index.less";
import { reqChoroplethMapData, reqCountryData } from "@/services/api";

export interface IChoropleth {
  selectedCountries: Array<string>;
  selectedColors: Array<string>;
  parentClass: string;
}

const Choropleth: React.FC<IChoropleth> = (props) => {
  const { selectedCountries, selectedColors, parentClass } = props;

  const handleData = async () => {
    // req data
    const res: any = await reqChoroplethMapData({
      year: "2019",
      category: ["1", "2", "3"],
      countries: selectedCountries,
    });
    const data = res.data;

    const reqAllCountries: any = await reqCountryData();
    const allCountries = reqAllCountries.data;

    // calc color for each nation
    Object.keys(data).forEach((id) => {
      // 过滤掉Asia经济体
      if (id == "490") {
        return;
      }
      let curDigit2;

      curDigit2 = allCountries[id]["iso_2digit_alpha"].toLowerCase();

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

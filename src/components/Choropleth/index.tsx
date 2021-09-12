import { useEffect } from "react";
import { select } from "d3";
import styles from "./index.less";
import { iDToNameMap } from "@/utils/processCountriesMap";
import CountryMap from "../CountryMap";

export interface IChoropleth {
  data: any;
  selectedCountries: Array<string>;
  selectedColors: Array<string>;
}

// TODO: 统一数据输入
const Choropleth: React.FC<IChoropleth> = (props) => {
  const { data, selectedCountries, selectedColors } = props;
  useEffect(() => {
    Object.keys(data).forEach((id) => {
      const fullName = iDToNameMap.get(id);
      if (!fullName) {
        return;
      }
      console.log(id, iDToNameMap.get(id), fullName, styles["Choropleth"]);
      const impCountry = Object.keys(data[id])[0];
      try {
        select(`.choropleth [aria-label='${fullName}']`)
          .attr("fill", selectedColors[selectedCountries.indexOf(impCountry)])
          .attr("opacity", data[id][impCountry]);
      } catch {
        return;
      }
    });
  }, [data, selectedCountries, selectedColors]);

  return (
    <div className="choropleth">
      <CountryMap
        name="World"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

export default Choropleth;

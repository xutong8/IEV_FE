import { useEffect } from "react";
import { select } from "d3";
import { iDToNameMap, nameToDigit2TotalMap } from "@/utils/processCountriesMap";
import CountryMap from "../CountryMap";

export interface IChoropleth {
  data: any;
  selectedCountries: Array<string>;
  selectedColors: Array<string>;
  parentClass: string;
}

// TODO: 统一数据输入; 解决列表中国家的处理
const Choropleth: React.FC<IChoropleth> = (props) => {
  const { data, selectedCountries, selectedColors, parentClass } = props;
  useEffect(() => {
    console.log(data);
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
        // 其他情况
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
  }, [data, selectedCountries, selectedColors]);

  return (
    <CountryMap
      name="World"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default Choropleth;

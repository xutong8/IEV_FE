import { countryColorMap } from "@/constants/colorMap";
import dataSource from "@/data/nameToDigit2.json";
import randomcolor from "randomcolor";

const colorMap = new Map<string, string>();
const generateCountryColor = () => {
  dataSource.results.forEach((country, index: number) => {
    colorMap.set(
      country.iso_2digit_alpha,
      countryColorMap[country.iso_2digit_alpha]
    );
  });
};

export { generateCountryColor, colorMap };

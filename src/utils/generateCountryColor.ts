import dataSource from "@/data/nameToDigit2.json";
import randomcolor from "randomcolor";

const colorMap = new Map<string, string>();
const generateCountryColor = () => {
  const len = dataSource.results.length;
  const colors = randomcolor({ count: len });

  dataSource.results.forEach((country, index: number) => {
    colorMap.set(country.iso_2digit_alpha, colors[index]);
  });
};

export { generateCountryColor, colorMap };

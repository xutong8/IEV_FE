import { countries } from "@/constants/countries";
import randomcolor from "randomcolor";

const colorMap = new Map<string, string>();
const generateCountryColor = () => {
  const len = countries.length;
  const colors = randomcolor({ count: len });

  countries.forEach((country, index: number) => {
    colorMap.set(country, colors[index]);
  });
};

export { generateCountryColor, colorMap };

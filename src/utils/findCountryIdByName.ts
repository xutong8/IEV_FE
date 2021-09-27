import dataSource from "@/data/nameToDigit2.json";

const findCountryIdByName = (name: string) => {
  return dataSource.results.find((item) => item.name === name)?.id ?? "";
};

export { findCountryIdByName };

import { nameToIDObj } from "@/constants/nameMapToID";

const findCountryIdByName = (name: string) => {
  return nameToIDObj[name];
};

export { findCountryIdByName };

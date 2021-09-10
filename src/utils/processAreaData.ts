import totalData from "../data/totalData.json";
import { iDToNameMap } from "./processCountriesMap";

export interface IYearExpSumEachCountry {
  [index: string]: number;
}

export interface ITotalData {
  [index: string]: IYearCountryData;
}

export interface IYearCountryData {
  [index: string]: ICountryData;
}

export interface ICountryData {
  continent: string;
  country_name_abbreviation: string;
  country_name_full: string;
  explist: (string | number)[][];
  expsum: number;
  implist: (string | number)[][];
  impsum: number;
  iso_2digit_alpha: string;
  iso_3digit_alpha: string;
}

export interface IStackAreaData {
  [index: string]: number;
  date: number;
}

export interface IAreaData {
  [index: number]: IStackAreaData;
  columns?: Array<string>;
}
console.log();
const filterCountry = (filterList: Array<string> = []) => {
  // prepare map data
  const areaData = Object.keys(totalData as ITotalData).map((key) => {
    const yearExpSumEachCountry = {} as IYearExpSumEachCountry;
    Object.keys((totalData as ITotalData)[key]).forEach((id) => {
      // filter data
      if (filterList.includes(iDToNameMap.get(id))) {
        // 模拟continue
        console.log("filter");
        return;
      }
      const curCountry = (totalData as ITotalData)[key][id] as ICountryData;
      yearExpSumEachCountry[curCountry.iso_2digit_alpha] = curCountry.expsum;
    });

    return {
      date: Number(key),
      ...yearExpSumEachCountry,
    };
  });

  (areaData as IAreaData).columns = Object.keys(areaData[0]);

  return areaData;
};

function initializeData() {
  return filterCountry();
}

const areaDataRaw = initializeData();

export { areaDataRaw, filterCountry };

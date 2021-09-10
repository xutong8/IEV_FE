import totalData from "../data/totalData.json";
import {
  iDToNameMap,
  nameToDigit2Map,
  nameToIDMap,
} from "./processCountriesMap";

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

// array: 国家全名
const selectedCounties = [
  "China",
  "USA",
  "India",
  "Japan",
  "Germany",
  "Russian Federation",
  "Indonesia",
  "Brazil",
  "United Kingdom",
  "France",
  "Mexico",
  "Italy",
  "Turkey",
  "Dem. People's Rep. of Korea",
];
// array: 国家对应ID
const selectedIDArray: Array<string> = selectedCounties.map((item) =>
  nameToIDMap.get(item)
);

// array: 国家全名对应缩写,便于legend展示
const selected2Digit = selectedCounties.map((item) =>
  nameToDigit2Map.get(item)
);

/**
 * 将全部数据通过参数数组进行过滤预处理
 * @param filterCountries 堆栈图所需展示的国家ID
 * @param selectedIDs 堆栈图所需过滤的国家ID
 */
const filterCountry = (
  filterCountries: Array<string> = [],
  selectedIDs: Array<string> = selectedIDArray
) => {
  // prepare map data
  const areaData = Object.keys(totalData as ITotalData).map((key) => {
    const yearExpSumEachCountry = {} as IYearExpSumEachCountry;
    Object.keys((totalData as ITotalData)[key]).forEach((id) => {
      // filter data
      if (selectedIDs.includes(id)) {
        // TODO: 因为没有Digit2到ID的映射所以需要映射两次
        if (
          filterCountries.includes(nameToDigit2Map.get(iDToNameMap.get(id)))
        ) {
          return;
        }
        const curCountry = (totalData as ITotalData)[key][id] as ICountryData;
        yearExpSumEachCountry[curCountry.iso_2digit_alpha] = curCountry.expsum;
      }
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
  return filterCountry([], selectedIDArray);
}

const areaDataRaw = initializeData();

export { areaDataRaw, filterCountry, selectedCounties, selected2Digit };

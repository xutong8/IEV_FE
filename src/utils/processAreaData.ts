import totalData from "../data/totalData.json";

const keys = [] as any;

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
  [index: number]: IStackAreaData | Array<string>;
  columns?: Array<string>;
}

function initializeData() {
  // prepare map data
  const areaData = Object.keys(totalData as ITotalData).map((key) => {
    const yearExpSumEachCountry = {} as IYearExpSumEachCountry;
    Object.keys((totalData as ITotalData)[key]).forEach((id) => {
      const curCountry = (totalData as ITotalData)[key][id] as ICountryData;
      yearExpSumEachCountry[curCountry.iso_2digit_alpha] = curCountry.expsum;
    });

    return {
      date: Number(key),
      ...yearExpSumEachCountry,
    };
  });

  // init keys
  Object.keys((totalData as ITotalData)["1995"]).forEach((id) => {
    const curCountry = (totalData as ITotalData)["1995"][id];
    keys.push(curCountry.iso_2digit_alpha);
  });

  (areaData as IAreaData).columns = Object.keys(areaData[0]);

  return areaData;
}

const areaData = initializeData();
export { areaData, keys };

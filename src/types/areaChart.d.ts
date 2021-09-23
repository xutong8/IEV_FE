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

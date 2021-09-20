export interface IItem {
  countryName: string;
  expvalue: number;
}

export interface IRow {
  countryName: string;
  explist: IItem[];
}

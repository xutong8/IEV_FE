export type ValueType = "text" | "rect";

export interface ActionType {
  type: string;
  payload?: any;
}

export interface ICountry {
  [country: string]: number;
}

export interface ITradeCountry {
  expmap: ICountry;
  exptotal: number;
  impmap: ICountry;
  imptotal: number;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface ICategoryObj {
  categoryList: ICategory[];
  selectedCategory: ICategory[];
}

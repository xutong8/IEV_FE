export type ValueType = "text" | "rect";

export interface ActionType {
  type: string;
  payload?: object;
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

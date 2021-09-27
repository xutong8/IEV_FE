import valueType from "./valueType";
import { combineReducers } from "redux";
import { ICategoryObj, ValueType } from "@/types";
import year from "./year";
import radius from "./radius";
import categoryObj from "./categoryObj";
import countryList from "./countryList";
import { ITag } from "@/components/Tags";
export interface IStore {
  valueType: ValueType;
  year: number;
  radius: number;
  categoryObj: ICategoryObj;
  countryList: ITag[];
}

const rootReducer = combineReducers({
  valueType,
  year,
  radius,
  categoryObj,
  countryList,
});

export default rootReducer;

import valueType from "./valueType";
import { combineReducers } from "redux";
import { ICategoryObj, ValueType } from "@/types";
import year from "./year";
import radius from "./radius";
import categoryObj from "./categoryObj";
export interface IStore {
  valueType: ValueType;
  year: number;
  radius: number;
  categoryObj: ICategoryObj;
}

const rootReducer = combineReducers({
  valueType,
  year,
  radius,
  categoryObj,
});

export default rootReducer;

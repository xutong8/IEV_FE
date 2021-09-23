import valueType from "./valueType";
import { combineReducers } from "redux";
import { ValueType } from "@/types";
import year from "./year";
import radius from "./radius";
export interface IStore {
  valueType: ValueType;
  year: number;
  radius: number;
}

const rootReducer = combineReducers({
  valueType,
  year,
  radius,
});

export default rootReducer;

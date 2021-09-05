import valueType from "./valueType";
import { combineReducers } from "redux";
import { ValueType } from "@/types";
export interface IStore {
  valueType: ValueType;
}

const rootReducer = combineReducers({
  valueType,
});

export default rootReducer;

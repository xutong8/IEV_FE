import { ActionType } from "@/types";
import {
  UPDATE_YEAR,
  ADD_ONE_YEAR,
  max_year,
  min_year,
} from "../constants/year";

const year = (state = min_year, action: ActionType) => {
  switch (action.type) {
    case UPDATE_YEAR:
      return action.payload;
    case ADD_ONE_YEAR:
      if (state >= max_year) {
        return max_year;
      }
      return state + 1;
    default:
      return state;
  }
};

export default year;

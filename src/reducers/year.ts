import { ActionType } from "@/types";
import { UPDATE_YEAR } from "../constants/year";

const year = (state = 2019, action: ActionType) => {
  switch (action.type) {
    case UPDATE_YEAR:
      return action.payload;
    default:
      return state;
  }
};

export default year;

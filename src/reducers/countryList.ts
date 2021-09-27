import { ITag } from "@/components/Tags";
import { ActionType } from "@/types";
import { ADD_COUNTRY, DEL_COUNTRY } from "../constants/countryList";

const radius = (state = [] as ITag[], action: ActionType) => {
  switch (action.type) {
    case ADD_COUNTRY:
      return [...state, action.payload];
    case DEL_COUNTRY:
      return state.filter((country) => country.id !== action.payload?.id);
    default:
      return state;
  }
};

export default radius;

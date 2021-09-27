import { ITag } from "@/components/Tags";
import { ADD_COUNTRY, DEL_COUNTRY } from "@/constants/countryList";

export const addCountryItem = (payload: ITag) => {
  return {
    type: ADD_COUNTRY,
    payload,
  };
};

export const delCountryItem = (payload: ITag) => {
  return {
    type: DEL_COUNTRY,
    payload,
  };
};

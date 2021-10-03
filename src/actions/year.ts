import { ADD_ONE_YEAR, UPDATE_YEAR } from "@/constants/year";

export const updateYear = (payload: number) => {
  return {
    type: UPDATE_YEAR,
    payload,
  };
};

export const addOneYear = () => {
  return {
    type: ADD_ONE_YEAR,
  };
};

import { UPDATE_YEAR } from "@/constants/year";

export const updateYear = (payload: number) => {
  return {
    type: UPDATE_YEAR,
    payload,
  };
};

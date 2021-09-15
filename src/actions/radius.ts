import { CHANGE_RADIUS } from "@/constants/radius";

export const changeRadius = (payload: number) => {
  return {
    type: CHANGE_RADIUS,
    payload,
  };
};

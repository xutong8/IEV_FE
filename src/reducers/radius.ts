import { ActionType } from "@/types";
import { CHANGE_RADIUS } from "../constants/radius";

const radius = (state = 12, action: ActionType) => {
  switch (action.type) {
    case CHANGE_RADIUS:
      return action.payload;
    default:
      return state;
  }
};

export default radius;

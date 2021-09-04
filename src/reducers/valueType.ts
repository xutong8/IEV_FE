import { ActionType } from "@/types";
import { UPDATE_VALUE_TYPE } from "../constants/actionTypes";
import { RECT_VALUE, TEXT_VALUE } from "../constants/valueTypes";

const valueType = (state = TEXT_VALUE, action: ActionType) => {
  switch (action.type) {
    case UPDATE_VALUE_TYPE:
      return state === TEXT_VALUE ? RECT_VALUE : TEXT_VALUE;
    default:
      return state;
  }
};

export default valueType;

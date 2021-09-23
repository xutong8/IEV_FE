import { ActionType, ICategory } from "@/types";
import {
  ADD_CATEGORY,
  DEL_CATEGORY,
  CHANGE_CATEGORY_OBJ,
} from "../constants/categoryObj";

const categoryObj = (
  state = {
    categoryList: [] as ICategory[],
    selectedCategory: [] as ICategory[],
  },
  action: ActionType
) => {
  switch (action.type) {
    case CHANGE_CATEGORY_OBJ:
      return {
        categoryList: action.payload,
        selectedCategory:
          action.payload.length > 0 ? action.payload.slice(0, 1) : [],
      };
    case ADD_CATEGORY:
      return {
        categoryList: state.categoryList,
        selectedCategory: [...state.selectedCategory, action.payload],
      };
    case DEL_CATEGORY:
      return {
        categoryList: state.categoryList,
        selectedCategory: state.selectedCategory.filter(
          (category) => category.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
};

export default categoryObj;

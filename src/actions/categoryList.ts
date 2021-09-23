import {
  ADD_CATEGORY,
  CHANGE_CATEGORY_OBJ,
  DEL_CATEGORY,
} from "@/constants/categoryObj";
import { ICategory } from "@/types";

export const changeCategoryObj = (payload: ICategory[]) => {
  return {
    type: CHANGE_CATEGORY_OBJ,
    payload,
  };
};

export const addCategoryItem = (payload: ICategory) => {
  return {
    type: ADD_CATEGORY,
    payload,
  };
};

export const delCategoryItem = (payload: ICategory) => {
  return {
    type: DEL_CATEGORY,
    payload,
  };
};

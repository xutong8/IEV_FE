import { ActionType, ICategory } from "@/types";
import {
  ADD_CATEGORY,
  DEL_CATEGORY,
  CHANGE_CATEGORY_OBJ,
  REPLACE_CATEGORY,
} from "../constants/categoryObj";

const categoryObj = (
  state = {
    categoryList: [] as ICategory[],
    /**
     * 在这里，有两个category数组，理由如下：
     * 因为点击category button时，界面的数据不需要立即更新，所以借助了两个category array。
     * 当用户点击Confirm button时，再更新界面数据。
     * */
    selectedCategory: [] as ICategory[],
    displayedCategory: [] as ICategory[],
  },
  action: ActionType
) => {
  switch (action.type) {
    case CHANGE_CATEGORY_OBJ: {
      const categoryArr =
        action.payload.length > 0 ? action.payload.slice(0, 1) : [];
      return {
        categoryList: action.payload,
        selectedCategory: categoryArr,
        displayedCategory: categoryArr,
      };
    }
    case ADD_CATEGORY:
      return {
        categoryList: state.categoryList,
        selectedCategory: state.selectedCategory,
        displayedCategory: [...state.displayedCategory, action.payload],
      };
    case DEL_CATEGORY:
      return {
        categoryList: state.categoryList,
        selectedCategory: state.selectedCategory,
        displayedCategory: state.displayedCategory.filter(
          (category) => category.id !== action.payload.id
        ),
      };
    case REPLACE_CATEGORY:
      return {
        categoryList: state.categoryList,
        displayedCategory: state.displayedCategory,
        selectedCategory: state.displayedCategory,
      };
    default:
      return state;
  }
};

export default categoryObj;

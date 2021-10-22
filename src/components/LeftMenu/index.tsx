import styles from "./index.less";
import { Tag, Spin, Button } from "antd";
import Title from "../Title";
import { httpRequest } from "@/services";
import { Image } from "../Images/ImageItem";
import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategoryItem,
  changeCategoryObj,
  delCategoryItem,
  replaceCategory,
} from "@/actions/categoryList";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";
import cn from "classnames";
import { addCountryItem, delCountryItem } from "@/actions/countryList";

// TODO: 高度在小屏幕上不对，这是出现滚动条的原因

const LeftMenu = () => {
  // country images
  const [countryImages, setCountryImages] = useState<Image[]>([]);
  // category images
  const [categoryImages, setCategoryImages] = useState<Image[]>([]);

  // dispatch
  const dispatch = useDispatch();

  // 获取国家列表和种类列表
  const fetchList = () => {
    Promise.all([
      httpRequest.get("/country_list"),
      httpRequest.get("/category_list"),
    ]).then((res: any) => {
      const countryImages = (
        res && res.length >= 0 ? res[0]?.data ?? [] : []
      ) as Image[];
      const categoryImages = (
        res && res.length >= 0 ? res[1]?.data ?? [] : []
      ) as Image[];
      unstable_batchedUpdates(() => {
        setCountryImages(countryImages);
        setCategoryImages(categoryImages);
        dispatch(
          changeCategoryObj(
            categoryImages.map((category) => ({
              id: category?.id ?? "",
              name: category?.name ?? "",
            }))
          )
        );
      });
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  // countryList selector
  const countryList = useSelector(
    (state: IStore) => state.countryList,
    (prev, next) => isEqual(prev, next)
  );

  // 处理国家被点击的事件
  const handleCountryClick = (image: Image) => {
    dispatch(
      countryList.find((country) => country.id === image.id)
        ? delCountryItem(image)
        : addCountryItem(image)
    );
  };

  // categoryObj selector
  const categoryObj = useSelector(
    (state: IStore) => ({
      displayedCategory: state.categoryObj.displayedCategory,
    }),
    (prev, next) => isEqual(prev, next)
  );

  // 处理种类点击事件
  const handleCategoryClick = (image: Image) => {
    const category = {
      id: image?.id ?? "",
      name: image?.name ?? "",
    };
    dispatch(
      categoryObj.displayedCategory.find((category) => category.id === image.id)
        ? delCategoryItem(category)
        : addCategoryItem(category)
    );
  };

  const handleConfirm = () => {
    dispatch(replaceCategory());
  };

  return (
    <div className={styles.leftmenu}>
      <div className={styles.item + " " + styles.itemTop}>
        <Title title="Country List" />
        <div
          className={styles.middle}
          style={{
            justifyContent:
              countryImages.length === 0 ? "center" : "flex-start",
          }}
        >
          <Spin spinning={countryImages.length === 0} />
          <div className={styles.list}>
            {countryImages.map((country) => (
              <div key={country.id} className={styles.countryContainer}>
                <div
                  className={`${styles.countryItem} ${cn({
                    [styles.clicked]:
                      countryList.find((item) => item.id === country.id) !==
                      undefined,
                  })}`}
                  onClick={() => handleCountryClick(country)}
                >
                  {country.name}
                </div>
                {/* <Tag
                  style={{
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                  className={cn({
                    [styles.clicked]:
                      countryList.find((item) => item.id === country.id) !==
                      undefined,
                  })}
                  onClick={() => handleCountryClick(country)}
                >
                  {country.name}
                </Tag> */}
              </div>
            ))}
          </div>
          {/* </Spin> */}
        </div>
      </div>
      <div className={styles.item + " " + styles.itemBottom}>
        <Title title="Category List" />
        <div
          className={styles.middle}
          style={{
            justifyContent:
              categoryImages.length === 0 ? "center" : "flex-start",
          }}
        >
          <Spin spinning={categoryImages.length === 0} />
          <div className={styles.list}>
            {categoryImages.map((category) => (
              <div key={category.id} className={styles.countryContainer}>
                <div
                  className={`${styles.countryItem} ${cn({
                    [styles.clicked]:
                      categoryObj.displayedCategory.find(
                        (item) => item.id === category.id
                      ) !== undefined,
                  })}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </div>
                {/* <Tag
                  style={{
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                  className={cn({
                    [styles.clicked]:
                      categoryObj.displayedCategory.find(
                        (item) => item.id === category.id
                      ) !== undefined,
                  })}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </Tag> */}
              </div>
            ))}
          </div>
          {/* </Spin> */}
        </div>
        <Button
          type="primary"
          size="small"
          className={styles.btn}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default LeftMenu;

import SearchTableWithStore from "@/containers/SearchTableWithStore";
import LeftMenu from "../LeftMenu";
import styles from "./index.less";
import Images from "../Images";
import StackChart from "../StackChart";
import ProgressBar from "../ProgressBar";
import PieMap from "../PieMap";
import { useRef, useState, useEffect } from "react";
import { useSVGSize } from "@/hooks/useSVGSize";
import ForceGraphWithStore from "@/containers/ForceGraphWithStore";
import { Image } from "../Images/ImageItem";
import { httpRequest } from "@/services";
import { unstable_batchedUpdates } from "react-dom";
import TopMapWithStore from "@/containers/TopMapWithStore";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategoryItem,
  changeCategoryObj,
  delCategoryItem,
} from "@/actions/categoryList";
import { IStore } from "@/reducers";
import { isEqual } from "lodash";

const BasicLayout = () => {
  // stack container的ref
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const [stackWidth, stackHeight] = useSVGSize(stackContainerRef);

  // country images
  const [countryImages, setCountryImages] = useState<Image[]>([]);
  // category images
  const [categoryImages, setCategoryImages] = useState<Image[]>([]);

  // dispatch
  const dispatch = useDispatch();

  // selector
  const categoryObj = useSelector(
    (state: IStore) => ({
      displayedCategory: state.categoryObj.displayedCategory,
    }),
    (prev, next) => isEqual(prev, next)
  );

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

  return (
    <div className={styles["basic_layout"]}>
      <div className={styles["left_menu"]}>
        <LeftMenu />
      </div>
      <div className={styles["main_content"]}>
        <div className={styles["top"]}>top</div>
        <div className={styles["middle"]}>
          <div className={styles["item"]}>
            <Images
              imageList={countryImages}
              column={7}
              bordered={true}
              imgStyle={{
                width: 60,
                margin: "4px 0",
              }}
            />
          </div>
          <div className={styles["item"]}>
            <Images
              imageList={categoryImages}
              column={5}
              imgStyle={{ boxShadow: "none", width: 40 }}
              style={{
                borderRadius: 4,
                marginTop: 10,
              }}
              styleProcessor={(image) => {
                return {
                  boxShadow: categoryObj.displayedCategory.find(
                    (cateogory) => image.id === cateogory.id
                  )
                    ? "-1px -1px 2px 2px rgba(0, 0, 0, 0.1)"
                    : "1px 1px 1px 1px rgba(0, 0, 0, 0.1)",
                };
              }}
              onClick={handleCategoryClick}
            />
          </div>
        </div>
        <div className={styles["bottom"]}>
          <div className={styles.first}>
            <div className={styles.firstLeft}>
              <div className={styles.topMap}>
                <TopMapWithStore />
              </div>
            </div>
            <div className={styles.firstRight}>
              <div className={styles.force}>
                <ForceGraphWithStore />
              </div>
            </div>
          </div>
          <div className={styles.second}>
            <div className={styles.secondLeft}>
              <div className={styles.pieMapContainer}>
                <PieMap />
              </div>
            </div>
            <div className={styles.secondRight}>
              <div className={styles.stack} ref={stackContainerRef}>
                <StackChart width={stackWidth} height={stackHeight} />
              </div>
            </div>
          </div>
          <div className={styles.progress}>
            <ProgressBar width="100%" height="100%" />
          </div>
        </div>
      </div>
      <div className={styles["right_menu"]}>
        <SearchTableWithStore />
      </div>
    </div>
  );
};

export default BasicLayout;

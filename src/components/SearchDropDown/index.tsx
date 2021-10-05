import { countries } from "@/constants/countries";
import { filterCountry } from "@/utils/getFilterCountryList";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import styles from "./index.less";
export interface ISearchDropDown {
  width: number;
  drawedRadar: Array<string>;
  addRadar: (name: string) => void;
}
// todo: 调整多行文本的CSS
const SearchDropDown: React.FC<ISearchDropDown> = (props) => {
  const { addRadar, drawedRadar } = props;
  const countryList = countries;
  const [isActive, setIsActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [popupShow, setPopupShow] = useState(false);
  const [highLightIndex, setHighLightIndex] = useState(0);
  const [countryNames, setCountries] = useState<Array<string>>(
    filterCountry(countryList, drawedRadar)
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setCountries(filterCountry(countryList, drawedRadar));
  }, [drawedRadar]);
  // 渲染输入栏右侧的倒三角
  const renderCaretSVG = (
    isActive: boolean,
    hovered: boolean,
    popupShown: boolean
  ) => {
    return popupShown ? (
      <svg
        className={
          isActive || hovered ? styles["show_arrow"] : styles["hide_arrow"]
        }
        width="10"
        height="5"
        fill="currentColor"
      >
        <path d="M0 5 H10 L5 0 z" />
      </svg>
    ) : (
      <svg
        className={
          isActive || hovered ? styles["show_arrow"] : styles["hide_arrow"]
        }
        width="10"
        height="5"
        fill="currentColor"
      >
        <path d="M0 0 H10 L5 5 z" />
      </svg>
    );
  };
  // 事件处理函数
  const handleFocus = () => {
    setIsActive(true);
    setPopupShow(true);
  };

  const handleBlur = () => {
    setIsActive(false);
    setPopupShow(false);
  };

  const handleHover = () => {
    setHovered(true);
  };

  const handleUnHovered = () => {
    setHovered(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(drawedRadar);
    const newList = filterCountry(countryList, drawedRadar, value);
    if (!highLightIndex) {
      setHighLightIndex(0);
    }
    setCountries([...newList]);
  };

  const handleItemClick = (value: string) => {
    // if (inputRef?.current) {
    //   inputRef.current.value = value;
    //   const newList = filterCountry(value, countryList);

    //   setCountries([...newList]);
    // }
    handleEnterKeyDown(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const keyMap: { [eventType: string]: Function } = {
      ArrowUp: handleArrowUpKeyDown,
      ArrowDown: handleArrowDownKeyDown,
      Enter: handleEnterKeyDown,
    };

    if (keyMap[e.key]) {
      keyMap[e.key]();
    }
  };

  const handleArrowUpKeyDown = () => {
    setHighLightIndex(Math.max(highLightIndex - 1, 0));
  };
  // TODO: 实现键盘操作时跟随滚动
  const handleArrowDownKeyDown = () => {
    const newIndex = Math.min(highLightIndex + 1, countryNames.length - 1);

    setHighLightIndex(newIndex);
  };

  const handleEnterKeyDown = (value = "") => {
    if (inputRef?.current) {
      const countryName = value ? value : countryNames[highLightIndex];
      addRadar(countryName);
      inputRef.current.value = "";
      inputRef.current.blur();
      setCountries(countryList);
      // handleItemClick("");
      handleBlur();
    }
  };

  return (
    <div className={styles["search_area"]}>
      <div
        className={styles["search_dropdown"]}
        // style={{ width: 72 }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleHover}
        onMouseLeave={handleUnHovered}
        onKeyDown={handleKeyDown}
      >
        <input
          type="text"
          placeholder="Enter Country Name"
          onChange={handleChange}
          ref={inputRef}
        />
        <div className={styles["div_arrow"]}>
          {renderCaretSVG(isActive, hovered, popupShow)}
        </div>
        {popupShow && (
          <div className={styles.dropdown} ref={dropdownRef}>
            {countryNames.map((item, index) => (
              <div
                key={item}
                className={`${styles.option} ${
                  highLightIndex === index ? styles["hightlight"] : ""
                }`}
                onMouseDown={() => handleItemClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <button className={styles["btn"]}>Add</button> */}
    </div>
  );
};

export default SearchDropDown;

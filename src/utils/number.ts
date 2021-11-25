/**
 * 大数字转换，将大额数字转换为万、千万、亿等
 * @param value 数字值
 */
export function numberFormat(value: number) {
  const newValue = ["", "", ""];
  let fr = 1000;
  let num = 3;
  let text1 = "";
  let fm = 1;
  while (value / fr >= 1) {
    fr *= 10;
    num += 1;
  }
  if (num <= 4) {
    // 千
    newValue[0] = String(value / 1000);
    newValue[1] = "千";
  } else if (num <= 8) {
    // 万
    text1 = (num - 4) / 3 > 1 ? "千万" : "万";
    fm = text1 === "万" ? 10000 : 10000000;
    if (value % fm === 0) {
      newValue[0] = String(value / fm);
    } else {
      newValue[0] = String((value / fm).toFixed(2));
    }
    newValue[1] = text1;
  } else if (num <= 16) {
    // 亿
    text1 = (num - 8) / 3 > 1 ? "千亿" : "亿";
    text1 = (num - 8) / 4 > 1 ? "万亿" : text1;
    text1 = (num - 8) / 7 > 1 ? "千万亿" : text1;
    fm = 1;
    if (text1 === "亿") {
      fm = 100000000;
    } else if (text1 === "千亿") {
      fm = 100000000000;
    } else if (text1 === "万亿") {
      fm = 1000000000000;
    } else if (text1 === "千万亿") {
      fm = 1000000000000000;
    }
    if (value % fm === 0) {
      newValue[0] = String(value / fm);
    } else {
      newValue[0] = String((value / fm).toFixed(2));
    }
    newValue[1] = text1;
  }
  if (value < 1000) {
    newValue[0] = String(value);
    newValue[1] = "";
  }
  return newValue.join("");
}

/**
 * 大数字转换，将大额数字转换为英文格式
 * @param value 数字值
 */
export function numberFormatE(value: number) {
  let unit;
  if (value >= 10e9) {
    unit = "B";
    // eslint-disable-next-line no-param-reassign
    value = Math.floor(value / 1e9);
  } else if (value >= 10e6) {
    unit = "M";
    // eslint-disable-next-line no-param-reassign
    value = Math.floor(value / 1e6);
  } else if (value >= 10e3) {
    unit = "K";
    // eslint-disable-next-line no-param-reassign
    value = Math.floor(value / 1e3);
  }
  return value.toLocaleString() + unit;
}

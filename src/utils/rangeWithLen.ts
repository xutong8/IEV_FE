const rangeWithLen = (start: number, end: number, len: number) => {
  let step = (end - start) / (len - 1);
  const array = new Array(len - 1)
    .fill(0)
    .map((item, index) => start + step * index);
  // array.pop();
  return array;
};

export default rangeWithLen;

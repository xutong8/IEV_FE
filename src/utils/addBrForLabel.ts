// 将一个由空格分隔的单词使用<br>标签进行替换，并且保证每一行字符尽可能接近length
export const addBrForLabel = (label: string, length: number) => {
  const array = label.split(" ");
  if (array.length == 1) return label;
  let rel = "";
  let temp = "";
  for (let word of array) {
    if (temp.length + word.length > length) {
      // 读入单词已经超过单行限制，加入换行标签
      rel = rel + (rel.length > 0 ? "<br>" + temp : temp);
      temp = word;
    } else {
      temp = (temp.length > 0 ? temp + " " : "") + word;
    }
  }
  if (temp) {
    rel = rel + "<br>" + temp;
  }
  return rel;
};

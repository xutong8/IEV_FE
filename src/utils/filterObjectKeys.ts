export const filterObjectKeys = (objects: any[], filterKeys: string[]) => {
  const res = [] as any[];

  if (filterKeys.length === 0) return objects;

  if (objects.length === 0) return res;

  // 全部的键
  const allKeys = Object.keys(objects[0]);
  objects.forEach((object) => {
    const item = {} as any;
    allKeys.forEach((key) => {
      if (filterKeys.includes(key)) {
        return;
      }
      item[key] = object[key];
    });
    res.push(item);
  });

  return res;
};

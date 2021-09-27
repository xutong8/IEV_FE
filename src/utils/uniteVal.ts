const uniteVal = (arr: any[]) => {
  const res = [] as any[];

  for (let i = 0; i < arr.length - 1; i++) {
    res.push([arr[i], arr[i + 1]]);
  }

  return res;
};

export { uniteVal };

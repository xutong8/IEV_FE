/**
 * 接受用户的输入值过滤出匹配的国家列表
 * @param value 当前用户输入框中输入的值
 * @param countries 所有的国家
 * @param filterList 已经绘制的国家，需要被过滤到防止重复绘制
 * @returns 过滤后的国家列表
 */
const filterCountry = (
  countries: Array<string> | undefined,
  filterList: Array<string>,
  value?: string
) => {
  if (!countries) {
    return [];
  }
  const filteredCountries = filterList.length
    ? countries.filter((item) => filterList.indexOf(item) === -1)
    : countries;

  // 针对于value是否具有输入值，也就是区分点击与输入两种情况
  if (value) {
    const lowerValue = value.toLocaleLowerCase();
    const filterCountries: Array<string> = [];
    filteredCountries.forEach((country) => {
      if (country.toLocaleLowerCase().indexOf(lowerValue) !== -1) {
        filterCountries.push(country);
      }
    });
    filterCountries.sort((a: string, b: string) => {
      let indexA = a.toLocaleLowerCase().indexOf(lowerValue);
      let indexB = b.toLocaleLowerCase().indexOf(lowerValue);
      if (indexA === indexB) {
        return a > b ? 1 : -1;
      } else {
        return indexA - indexB;
      }
    });

    return filterCountries;
  } else {
    return filteredCountries;
  }
};

export { filterCountry };

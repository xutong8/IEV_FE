import { iDtodigit2Map } from "./processCountriesMap";
import dataSource from "@/data/Y1995AndTypeCountry.json";
import { getCategoryById } from "./getCategoryById";

export interface ITableCountry {
  id: number;
  year: number;
  exportCountry: string;
  importCountry: string;
  category: string;
  amount: number;
}

const processTableData = () => {
  const countriesByYear = (dataSource as any)["1995"];

  const countriesId = Object.keys(countriesByYear) as string[];
  const result = [] as ITableCountry[];

  let id = 1;

  // 遍历import
  countriesId.forEach((countryId) => {
    // 根据国家id获取的是包含所有种类的对象
    const categoriesObj = (countriesByYear as any)[countryId];
    const categoriesId = Object.keys(categoriesObj) as string[];
    categoriesId.forEach((categoryId) => {
      const expmap = (categoriesObj as any)[categoryId]["expMap"];

      if (!expmap) return;

      const expList = Object.keys(expmap) as string[];
      expList.forEach((expId) => {
        const country = {} as ITableCountry;
        // 进口国家
        const importCountry = iDtodigit2Map.get(countryId);
        country.importCountry = importCountry;
        // TODO: 需要一个参数来接受年份
        country.year = 1995;
        // 根据种类id获取的种类字符串
        const category = getCategoryById(categoryId).slice(4);
        country.category = category;
        // 出口国家
        const exportCountry = iDtodigit2Map.get(expId);
        country.exportCountry = exportCountry;
        // id
        country.id = id++;
        // amount
        country.amount = Number((expmap[expId] as number).toFixed(2));

        result.push(country);
      });
    });
  });

  return result;
};

export { processTableData };

import tradeData from "@/data/tradeData.json";
import { ICountry, ITradeCountry } from "@/types/index";

export interface IItem {
  name: string;
  value: number;
}

export interface IRow {
  name: string;
  explist: IItem[];
}

const processHeatMapData = (
  countryNames: string[],
  year: string,
  category: string
) => {
  const dataSource: IRow[] = [];
  const countries = (tradeData as any)[year];

  let maxValue = -1;
  let minValue = Number.MAX_VALUE;

  countryNames.forEach((countryName) => {
    const row: IRow = {
      name: countryName,
      explist: [{ name: countryName, value: 0 }],
    };
    const { expmap } = countries[countryName][category] as ITradeCountry;
    const expCountries = Object.keys(expmap);
    expCountries.forEach((expCountry) => {
      row.explist.push({
        name: expCountry,
        value: expmap[expCountry],
      });
      maxValue = Math.max(maxValue, expmap[expCountry]);
      minValue = Math.min(minValue, expmap[expCountry]);
    });

    dataSource.push(row);
  });

  return {
    dataSource,
    maxValue,
    minValue,
  };
};

export { processHeatMapData };

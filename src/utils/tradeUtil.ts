import tradeData from "@/data/tradeData.json";
import { ICountry, ITradeCountry } from "@/types/index";
export interface ITradeItem {
  countryName: string;
  imptotal: number;
  exptotal: number;
}

const getLittleTradeData = (
  countryNames: string[],
  year: string,
  category: string
) => {
  const trades: ITradeItem[] = [];
  const countries = (tradeData as any)[year];
  countryNames.forEach((countryName) => {
    const { imptotal, exptotal } = countries[countryName][
      category
    ] as ITradeCountry;
    trades.push({
      countryName,
      imptotal,
      exptotal,
    });
  });
  return trades;
};

export { getLittleTradeData };
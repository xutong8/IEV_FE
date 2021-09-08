export interface IItemPieData {
  country: string;
  type: string;
  value: number;
}

const pieData: Array<IItemPieData> = [
  { country: "USA", type: "Textile", value: 15 },
  { country: "USA", type: "Animal", value: 10 },
  { country: "USA", type: "Agriculture", value: 17 },
  { country: "China", type: "Agriculture", value: 28 },
  { country: "China", type: "Animal", value: 9 },
  { country: "China", type: "Textile", value: 18 },
];

const selectCountries: Array<string> = ["USA", "China"];

export { pieData, selectCountries };

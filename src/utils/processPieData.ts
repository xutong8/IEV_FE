export interface IItemPieData {
  country: string;
  type: string;
  value: number;
}

const pieData: Array<IItemPieData> = [
  { country: "USA", type: "Textile", value: 15 },
  { country: "USA", type: "Animal", value: 10 },
  { country: "USA", type: "Agr", value: 17 },
  { country: "China", type: "Agr", value: 28 },
  { country: "China", type: "Animal", value: 9 },
  { country: "China", type: "Textile", value: 18 },
];

export { pieData };

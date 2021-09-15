import dataSource from "@/data/idToCategory.json";

export interface ICategory {
  id: string;
  text: string;
  parent: string;
}

const getCategoryById = (id: string) => {
  const item = dataSource.find((item) => item.id === id);
  return item?.text ?? "";
};

export { getCategoryById };

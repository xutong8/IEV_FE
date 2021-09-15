import idToCountryName from "@/data/idToCountryName.json";
import nameToDigit2Data from "@/data/nameToDigit2.json";
import totalData from "@/data/totalData.json";

interface IItem {
  text: string;
  id: string;
}

const partnerAreaIDAndNameData = idToCountryName.results;
const nameToIDMap = new Map();
const iDToNameMap = new Map();

partnerAreaIDAndNameData.forEach((item: IItem) => {
  nameToIDMap.set(item.text, item.id);
  iDToNameMap.set(item.id, item.text);
});

// 14个国家的映射
const nameToDigit2Map = new Map();
nameToDigit2Data.results.forEach((item) => {
  nameToDigit2Map.set(item.name, item.iso_2digit_alpha);
});

// 全部国家的映射
const nameToDigit2TotalMap = new Map();
Object.keys((totalData as any)["1995"]).forEach((item) => {
  nameToDigit2TotalMap.set(
    (totalData as any)["1995"][item]["country_name_abbreviation"],
    (totalData as any)["1995"][item]["iso_2digit_alpha"]
  );
});

export { nameToIDMap, iDToNameMap, nameToDigit2Map, nameToDigit2TotalMap };

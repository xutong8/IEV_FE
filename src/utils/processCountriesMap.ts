import partnerAreaIDAndNameJSON from "@/data/partnerAreaIDToName.json";
import nameToDigit2Data from "@/data/nameToDigit2.json";

interface IItem {
  text: string;
  id: string;
}

const partnerAreaIDAndNameData = partnerAreaIDAndNameJSON.results;
const nameToIDMap = new Map();
const iDToNameMap = new Map();

partnerAreaIDAndNameData.forEach((item: IItem) => {
  nameToIDMap.set(item.text, item.id);
  iDToNameMap.set(item.id, item.text);
});

const nameToDigit2Map = new Map();
nameToDigit2Data.results.forEach((item) => {
  nameToDigit2Map.set(item.name, item.iso_2digit_alpha);
});

export { nameToIDMap, iDToNameMap, nameToDigit2Map };

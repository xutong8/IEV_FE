import partnerAreaIDAndNameJSON from "@/data/idToCountryName.json";

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

export { nameToIDMap, iDToNameMap };

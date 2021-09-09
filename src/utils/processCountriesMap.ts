import partnerAreaIDAndNameJSON from "@/data/idToCountryName.json";

interface IItem {
  text: string;
  id: string;
}

const partnerAreaIDAndNameData = partnerAreaIDAndNameJSON.results;
const digit2ToIDMap = new Map();
const iDtodigit2Map = new Map();

partnerAreaIDAndNameData.forEach((item: IItem) => {
  digit2ToIDMap.set(item.text, item.id);
  iDtodigit2Map.set(item.id, item.text);
});

export { digit2ToIDMap, iDtodigit2Map };

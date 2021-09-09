import partnerAreaIDAndNameJSON from "@/data/partnerAreaIDToName.json";
const partnerAreaIDAndNameData = partnerAreaIDAndNameJSON.results;
const digit2ToIDMap = new Map();
const iDtodigit2Map = new Map();
partnerAreaIDAndNameData.forEach((item) => {
  digit2ToIDMap.set(item.text, item.id);
  iDtodigit2Map.set(item.text, item.id);
});

export { digit2ToIDMap, iDtodigit2Map };

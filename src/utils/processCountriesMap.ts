import partnerAreaIDAndNameJSON from "@/data/partnerAreaIDToName.json";
const partnerAreaIDAndNameData = partnerAreaIDAndNameJSON.results;
const nameToIDMap = new Map();
const iDToNameMap = new Map();
partnerAreaIDAndNameData.forEach((item) => {
  nameToIDMap.set(item.text, item.id);
  iDToNameMap.set(item.id, item.text);
});

export { nameToIDMap, iDToNameMap };

import partnerAreaIDAndNameJSON from "@/data/partnerAreaIDToName.json";
const partnerAreaIDAndNameData = partnerAreaIDAndNameJSON.results;
const digit2ToIDMap = new Map();
partnerAreaIDAndNameData.map((item) => {
  digit2ToIDMap.set(item.text, item.id);
});

export { digit2ToIDMap };

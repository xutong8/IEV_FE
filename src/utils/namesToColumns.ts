import nameToDigit2 from "@/data/nameToDigit2.json";
import { Nations } from "@/assets/images";

const namesToNations = new Map();
const namesToColumns = new Map();
const nationsToNames = new Map();

const processCountryName = () => {
  nameToDigit2.results.forEach((item, index: number) => {
    namesToNations.set(item.name, Nations[index].name);
    nationsToNames.set(Nations[index].name, item.name);
    namesToColumns.set(item.name, item.iso_2digit_alpha);
  });
};

export { namesToColumns, namesToNations, processCountryName, nationsToNames };

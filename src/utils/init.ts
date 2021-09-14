import { generateCountryColor } from "./generateCountryColor";
import { processCountryName } from "./namesToColumns";

const init = () => {
  generateCountryColor();
  processCountryName();
};

export default init;

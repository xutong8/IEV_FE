import { VectorMapProps } from "@south-paw/react-vector-maps";
import { initMapData } from "./initCountryJSON";

export interface IProjectData {
  mapData: Map<string, VectorMapProps>;
  countris: string[];
}

const initProjectData = (): IProjectData => {
  const mapData = initMapData();
  const countris = Array.from(mapData.keys());
  return {
    mapData,
    countris,
  };
};

export default initProjectData;

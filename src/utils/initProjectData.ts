import { VectorMapProps } from "@south-paw/react-vector-maps";
import { initMapData } from "./initCountryJSON";

export interface IProjectData {
  mapData: Map<string, VectorMapProps>;
}

const initProjectData = (): IProjectData => {
  const mapData = initMapData();
  return {
    mapData,
  };
};

export default initProjectData;

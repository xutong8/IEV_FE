import { VectorMapProps } from "@south-paw/react-vector-maps";

const initMapData = () => {
  const countriesMap = new Map<string, VectorMapProps>();
  const files = require.context("../data/maps", false, /.json$/);
  files.keys().forEach((file) => {
    // 从file匹配出完整的国家名称
    const countryReg = /\/.+\.json/gi;
    const countryName = (file.match(countryReg) as string[])[0].slice(1, -5);
    countriesMap.set(countryName, files(file));
  });
  return countriesMap;
};

export { initMapData };

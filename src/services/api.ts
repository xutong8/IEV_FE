import { httpRequest } from "./index";

export interface IChoroplethMapData {
  year: string;
  category: Array<string>;
  countries: Array<string>;
}

const reqChoroplethMapData = ({
  year,
  category,
  countries,
}: IChoroplethMapData) => {
  return httpRequest.get(
    `/choropleth_map?year=${year}&category=[${category}]&selectedCountries=[${countries}]`
  );
};

export { reqChoroplethMapData };

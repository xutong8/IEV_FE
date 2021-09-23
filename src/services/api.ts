import { httpRequest } from "./index";

export interface IReqWithSCounAndCat {
  year: number;
  category: string[];
  countries: Array<string>;
}

export const reqChoroplethMapData = ({
  year,
  category,
  countries,
}: IReqWithSCounAndCat) => {
  return httpRequest.get(
    `/choropleth_map?year=${year}&category=[${category}]&selectedCountries=[${countries}]`
  );
};

export const reqDonutChartData = ({
  year,
  category,
  countries,
}: IReqWithSCounAndCat) => {
  return httpRequest.get(
    `/donut_chart?year=${year}&category=[${category}]&selectedCountries=[${countries}]`
  );
};

export const reqCountryData = () => {
  return httpRequest.get("/all_countries");
};

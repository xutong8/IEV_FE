import { httpRequest } from "./index";

export interface IReqWithSCounAndCat {
  year: string;
  category: Array<string>;
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

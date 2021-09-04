import totalData from "../data/57-63_countries-trades_HS92_total_V202102.json";

const keys = [] as any;

function initializeData() {
  // prepare map data
  const areaData = Object.keys(totalData).map((key) => {
    const yearExpSumEachCountry = {} as any;
    Object.keys((totalData as any)[key]).forEach((id) => {
      const curCountry = (totalData as any)[key][id] as any;
      yearExpSumEachCountry[curCountry.iso_2digit_alpha] = curCountry.expsum;
    });
    return {
      date: key,
      ...yearExpSumEachCountry,
    };
  });

  // init keys
  Object.keys((totalData as any)[1995]).forEach((id) => {
    const curCountry = (totalData as any)[1995][id];
    keys.push(curCountry.iso_2digit_alpha);
  });

  (areaData as any).columns = Object.keys(areaData[0]);

  return areaData;
}

const areaData = initializeData();
export { areaData, keys };

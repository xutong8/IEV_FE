import totalData from "./57-63_countries-trades_HS92_total_V202102.json";

const keys = [];
const years = Object.keys(totalData).map((year) => new Date(year, 1, 1));
function initializeData() {
  // prepare map data
  let areaData = Object.keys(totalData).map((key) => {
    let yearExpSumEachCountry = {};
    Object.keys(totalData[key]).forEach((id) => {
      const curCountry = totalData[key][id];
      yearExpSumEachCountry[curCountry.iso_2digit_alpha] = curCountry.expsum;
    });
    return {
      date: new Date(key, 1, 1),
      ...yearExpSumEachCountry,
    };
  });
  // init keys
  Object.keys(totalData[1995]).forEach((id) => {
    const curCountry = totalData[1995][id];
    keys.push(curCountry.iso_2digit_alpha);
  });
  // init years

  return areaData;
}
console.log(totalData);
const areaData = initializeData();
export { areaData, keys, years };
// export const areaData = d3.transpose(Array.from({length: 3}, () => bumps(200, 10)))

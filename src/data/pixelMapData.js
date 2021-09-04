const countries = [
  "China",
  "Mongolia",
  "North Korea",
  "South Korea",
  "Japan",
  "Britain",
  "Ireland",
  "the Netherlands",
  "Belgium",
  "Luxembourg",
  "France",
  "Monaco",
];
const pixelMapData = {};
new Array(20).fill(0).forEach((item, index) => {
  pixelMapData[new Date(`${1995 + index}`)] = {};
});
Object.keys(pixelMapData).forEach((item) => {
  countries.forEach((country) => {
    pixelMapData[item][country] = Math.random() * 10000;
  });
});

export default pixelMapData;

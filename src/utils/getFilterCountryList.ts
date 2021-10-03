const filterCountry = (value: string, countries: Array<string> | undefined) => {
  if (!countries) {
    return [];
  }
  const lowerValue = value.toLocaleLowerCase();
  const filterCountries: Array<string> = [];
  countries.forEach((country) => {
    if (country.toLocaleLowerCase().indexOf(lowerValue) !== -1) {
      filterCountries.push(country);
    }
  });
  filterCountries.sort((a: string, b: string) => {
    let indexA = a.toLocaleLowerCase().indexOf(lowerValue);
    let indexB = b.toLocaleLowerCase().indexOf(lowerValue);
    if (indexA == indexB) {
      return a > b ? 1 : -1;
    } else {
      return indexA - indexB;
    }
  });

  return filterCountries;
};

export { filterCountry };

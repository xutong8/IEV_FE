import totalData from "@/data/Y1995AndTypeCountry.json";

/**
 * 根据选中的国家以及类型将总数据进行预处理
 * @param selectedCountries 选中的国家列表(在middle组件中选中的两个国家)
 * @param selectedTypes 选中的类型列表
 */
const processData = (
  selectedCountries: Array<string>,
  selectedTypes: Array<string>
) => {
  const year = Object.keys(totalData)[0];
  const choroplethData: any = {};
  Object.keys((totalData as any)[year]).forEach((id) => {
    let imp1 = 0;
    let imp2 = 0;
    let total = 0;
    selectedTypes.forEach((type) => {
      if (!(totalData as any)[year][id][type]) {
        return;
      }
      if ((totalData as any)[year][id][type]["impMap"][selectedCountries[0]]) {
        imp1 += (totalData as any)[year][id][type]["impMap"][
          selectedCountries[0]
        ];
      }
      if ((totalData as any)[year][id][type]["impMap"][selectedCountries[1]]) {
        imp2 += (totalData as any)[year][id][type]["impMap"][
          selectedCountries[1]
        ];
      }
      total += (totalData as any)[year][id][type]["impSum"];
    });
    choroplethData[id] =
      imp1 > imp2
        ? { [selectedCountries[0]]: imp1 / total }
        : { [selectedCountries[1]]: imp2 / total };
  });
  console.log(choroplethData);
  return choroplethData;
};

const data = processData(["156", "842"], ["0", "1", "2"]);

export { data };

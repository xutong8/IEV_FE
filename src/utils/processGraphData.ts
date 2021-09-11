import totalData from "@/data/totalData.json";

export interface IGraphNode {
  id: string;
  name: string;
  alpha3: string;
  continent: string;
  expsum: number;
  x?: number;
  y?: number;
}

export interface IGraphLink {
  source: IGraphNode;
  target: IGraphNode;
  value: number;
}

export interface IGraphData {
  nodes: IGraphNode[];
  links: IGraphLink[];
}

function initializeData(year: number, data: any) {
  const gData = {} as IGraphData;

  const curData = data[year];

  const nodes: IGraphNode[] = Object.keys(curData).map((v, i) => ({
    id: v,
    name: curData[v].country_name_full,
    alpha3: curData[v].iso_3digit_alpha,
    continent: curData[v].continent,
    expsum: curData[v].expsum,
  }));

  const links: IGraphLink[] = Object.keys(curData).reduce((total, v, i) => {
    if (curData[v].implist.length > 0) {
      const item = {
        target: nodes[i],
        source: nodes[Object.keys(curData).indexOf(curData[v].implist[0][0])],
        value: curData[v].implist[0][1],
      };
      total.push(item);
    }
    return total;
  }, [] as IGraphLink[]);

  gData.nodes = nodes;
  gData.links = links;

  return gData;
}

const processGraphData: (year: number) => IGraphData = (year: number) =>
  initializeData(year, totalData);

export { processGraphData };

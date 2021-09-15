import totalData from "@/data/totalData.json";
import randomcolor from "randomcolor";

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
  colorMap: Map<string, string>;
  continents: string[];
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

  const continentsSet = new Set<string>();
  for (const node of nodes) {
    continentsSet.add(node.continent);
  }
  const continents = Array.from(continentsSet);

  gData.nodes = nodes;
  gData.links = links;
  gData.continents = continents;
  gData.colorMap = getNodeColor(nodes);

  return gData;
}

const graphNodeColopMap = new Map();

function getNodeColor(nodes: IGraphNode[]) {
  if (graphNodeColopMap.size !== 0) {
    return graphNodeColopMap;
  }

  const continents = new Set();
  for (const node of nodes) {
    continents.add(node.continent);
  }

  const filteredContinents = Array.from(continents);

  const colors = randomcolor({
    count: filteredContinents.length,
  });

  filteredContinents.forEach((continent, index) => {
    graphNodeColopMap.set(continent, colors[index]);
  });

  return graphNodeColopMap;
}

const processGraphData: (year: number) => IGraphData = (year: number) =>
  initializeData(year, totalData);

export { getNodeColor, processGraphData, graphNodeColopMap };

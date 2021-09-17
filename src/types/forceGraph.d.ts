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

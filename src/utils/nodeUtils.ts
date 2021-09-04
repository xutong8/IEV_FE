import { select } from "d3-selection";
import { IGraphData, IGraphLink, IGraphNode } from "./processGraphData";

// 获取节点的完整id
const getNodeId = (id: string) => `node${id}`;

// 寻找相连的节点
const findNodes = (event: MouseEvent, links: IGraphLink[]) => {
  const id = (event.target as HTMLElement).id.slice(4);
  const filteredLinks = links.filter((link) => {
    return link.source.id === id || link.target.id === id;
  });
  const filteredNodesSet = new Set<string>();
  for (const link of filteredLinks) {
    filteredNodesSet.add(link.source.id);
    filteredNodesSet.add(link.target.id);
  }
  const filteredNodes = Array.from(filteredNodesSet);
  return filteredNodes;
};

// 根据id来查找node
const findNodeById = (nodes: IGraphNode[], id: string) => {
  return nodes.find((node) => node.id === id);
};

// 高亮节点
const highlightNodeById = (id: string) => {
  select(`#${getNodeId(id)}`).attr("fill", "purple");
};

// 取消高亮节点
// TODO: 不需要nodes参数
const unhighlightNodeById = (graphData: IGraphData, id: string) => {
  const { nodes, colorMap } = graphData;
  select(`#${getNodeId(id)}`).attr(
    "fill",
    colorMap.get((findNodeById(nodes, id) as IGraphNode).continent) as string
  );
};

export {
  findNodes,
  findNodeById,
  getNodeId,
  highlightNodeById,
  unhighlightNodeById,
};

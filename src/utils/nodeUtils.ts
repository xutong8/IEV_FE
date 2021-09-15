import { select } from "d3-selection";
import {
  getNodeColor,
  IGraphData,
  IGraphLink,
  IGraphNode,
} from "./processGraphData";

// 获取节点的完整id
const getNodeId = (id: string) => `node${id}`;

// 寻找相连的节点
const findNodes = (event: MouseEvent, links: IGraphLink[]) => {
  const id = (event.target as HTMLElement).id.slice(4);
  const filteredLinks = links.filter((link) => {
    return link.source.id === id || link.target.id === id;
  });
  const filteredNodesSet = new Set<string>();
  // 如果该点没有边与其相连，不直接添加进入，则不会被高亮
  filteredNodesSet.add(id);
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
const highlightNodeById = (filteredNodes: IGraphNode[], id: string) => {
  // 高亮节点为紫色
  const circle = select(`#${getNodeId(id)}`);
  circle.attr("fill", "purple");
  // 添加国家的名称
  const node = findNodeById(filteredNodes, id);
  select(`#forceNodes`)
    .append("text")
    .attr("x", Number.parseFloat(circle.attr("cx") ?? 0) + 10)
    .attr("y", Number.parseFloat(circle.attr("cy") ?? 0) + 2)
    .text(node?.name ?? "");
};

// 取消高亮节点
// TODO: 不需要nodes参数
const unhighlightNodeById = (graphData: IGraphData, id: string) => {
  const { nodes } = graphData;
  select(`#${getNodeId(id)}`).attr(
    "fill",
    getNodeColor(nodes).get((findNodeById(nodes, id) as IGraphNode).continent)
  );
  select(`#forceNodes`).select("text").remove();
};

export {
  findNodes,
  findNodeById,
  getNodeId,
  highlightNodeById,
  unhighlightNodeById,
};

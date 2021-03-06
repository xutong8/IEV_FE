import { select } from "d3-selection";
import { IGraphLink, IGraphNode } from "@/types/forceGraph";
import { IStore } from "@/reducers";
import { countries } from "@/constants/countries";

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
    .attr("id", "label" + id)
    .text(node?.name ?? "");
};

// 取消高亮节点
// TODO: 不需要nodes参数
const unhighlightNodeById = (
  nodes: IGraphNode[],
  id: string,
  colorMap: Map<string, string>
) => {
  select(`#${getNodeId(id)}`).attr(
    "fill",
    colorMap?.get((findNodeById(nodes, id) as IGraphNode).continent) ?? ""
  );
  select(`#forceNodes`).select(`#label${id}`).remove();
};

// 为left menu中选中国家添加标签
const addLabelById = (id: string, name: string) => {
  const circle = select(`#${getNodeId(id)}`);
  select(`#forceNodes`)
    .append("text")
    .attr("x", Number.parseFloat(circle.attr("cx") ?? 0) + 10)
    .attr("y", Number.parseFloat(circle.attr("cy") ?? 0) + 2)
    .attr("id", "label" + id)
    .text(name);
};
// left menu取消选中后删除标签
const removeLabelById = (id: string) => {
  select(`#forceNodes`).select(`#label${id}`).remove();
};
// 布局变化后更新所有标签的位置
const updateLabelPos = (countryList: any) => {
  // const textArray = Array.from(document.querySelectorAll("#forceNodes text"));
  for (let country of countryList) {
    const text = document.querySelector(`#forceNodes #label${country.id}`);
    const node = document.getElementById(`${getNodeId(country.id ?? "")}`);

    if (node) {
      if (text) {
        text.setAttribute(
          "x",
          String(Number.parseFloat(node.getAttribute("cx") ?? "0") + 10)
        );
        text.setAttribute(
          "y",
          String(Number.parseFloat(node.getAttribute("cy") ?? "0") + 2)
        );
      } else {
        addLabelById(country.id, country.name);
      }
    } else {
      text?.remove();
    }
  }
};

export {
  findNodes,
  findNodeById,
  getNodeId,
  highlightNodeById,
  unhighlightNodeById,
  addLabelById,
  removeLabelById,
  updateLabelPos,
};

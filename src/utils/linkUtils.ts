import { select } from "d3-selection";
import { IGraphLink } from "@/types/forceGraph";

// 根据id来查找link
const findLinkById = (event: MouseEvent, links: IGraphLink[]) => {
  const linkId = (event.target as HTMLElement).id.slice(4);
  return links.find((link) => {
    const sourceId = link.source.id;
    const targetId = link.target.id;
    return `${sourceId}_${targetId}` === linkId;
  }) as IGraphLink;
};

// 获取link的完整id
const getLinkId = (link: IGraphLink) => {
  const sourceId = link.source.id;
  const targetId = link.target.id;
  return `link${sourceId}_${targetId}`;
};

// 高亮link
const highlightLink = (link: IGraphLink) => {
  select(`#${getLinkId(link)}`).attr("stroke", "purple");
};

// 取消高亮link
const unhighlightLink = (link: IGraphLink) => {
  select(`#${getLinkId(link)}`).attr("stroke", "#999");
};

export { findLinkById, getLinkId, highlightLink, unhighlightLink };

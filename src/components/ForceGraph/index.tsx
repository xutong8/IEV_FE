import { processGraphData, getNodeColor } from "@/utils/processGraphData";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ForceNode from "./ForceNode";
import styles from "./index.less";
import {
  forceSimulation,
  forceLink,
  forceCenter,
  forceCollide,
} from "d3-force";
import { selectAll } from "d3-selection";
import { scaleLinear } from "d3-scale";
import ForceLink from "./ForceLink";
import { forceManyBody } from "d3";
import {
  findNodes,
  getNodeId,
  highlightNodeById,
  unhighlightNodeById,
} from "@/utils/nodeUtils";
import {
  findLinkById,
  highlightLink,
  unhighlightLink,
} from "@/utils/linkUtils";
import { useSVGSize } from "@/hooks/useSVGSize";

export interface IForceGraphProps {
  width: number | string;
  height: number | string;
}

const ForceGraph: React.FC<IForceGraphProps> = (props) => {
  const { width, height } = props;
  const [year, setYear] = useState<number>(1995);
  const graphData = useMemo(() => processGraphData(year), [year]);
  const { nodes, links } = graphData;

  // useEffect(() => {
  //   setInterval(() => {
  //     setYear((year) => year + 1);
  //   }, 15000);
  // }, []);

  const svgRef = useRef<SVGSVGElement>(null);

  const [computedWidth, computedHeight] = useSVGSize(svgRef);

  // 按照expsum的值来映射节点的半径
  const minNode = useMemo(() => {
    return Math.min(...nodes.map((node) => node.expsum));
  }, [nodes]);
  const maxNode = useMemo(() => {
    return Math.max(...nodes.map((node) => node.expsum));
  }, [nodes]);

  const nodeScale = scaleLinear().domain([minNode, maxNode]).range([2, 6]);

  // 按照value值来映射边的长短
  const minLink = useMemo(() => {
    return Math.min(...links.map((link) => link.value));
  }, [links]);
  const maxLink = useMemo(() => {
    return Math.max(...links.map((link) => link.value));
  }, [links]);

  const linkScale = scaleLinear().domain([minLink, maxLink]).range([4, 8]);

  // 设置布局算法
  const simulation = forceSimulation(nodes as any)
    .force(
      "link",
      forceLink(links as any)
        .id((d: any) => d.id)
        .distance((d) => linkScale((d as any)?.value ?? 1))
    )
    .force("charge", forceManyBody().distanceMax(30))
    .force("collide", forceCollide().radius(5))
    .force("center", forceCenter(computedWidth / 2, computedHeight / 2));

  useEffect(() => {
    simulation.on("tick", () => {
      selectAll(`.${styles.node}`)
        .data(nodes)
        .attr("cx", (d) => d.x as number)
        .attr("cy", (d) => d.y as number);

      selectAll(`.${styles.link}`)
        .data(links)
        .attr("x1", (d) => d.source.x as number)
        .attr("y1", (d) => d.source.y as number)
        .attr("x2", (d) => d.target.x as number)
        .attr("y2", (d) => d.target.y as number);
    });
  }, [simulation, width, height, nodes, links]);

  // enter node高亮
  const nodeMouseEnterHandler = (event: MouseEvent) => {
    const filteredNodes = findNodes(event, links);
    for (const nodeId of filteredNodes) {
      highlightNodeById(nodeId);
    }
    const filteredLinks = links.filter(
      (link) =>
        filteredNodes.includes(link.source.id) &&
        filteredNodes.includes(link.target.id)
    );
    for (const link of filteredLinks) {
      highlightLink(link);
    }
  };
  // leave node取消高亮
  const nodeMouseLeaveHandler = (event: MouseEvent) => {
    const filteredNodes = findNodes(event, links);
    for (const nodeId of filteredNodes) {
      unhighlightNodeById(graphData, nodeId);
    }
    const filteredLinks = links.filter(
      (link) =>
        filteredNodes.includes(link.source.id) &&
        filteredNodes.includes(link.target.id)
    );
    for (const link of filteredLinks) {
      unhighlightLink(link);
    }
  };

  // enter link高亮
  const linkMouseEnterHandler = (event: MouseEvent) => {
    const link = findLinkById(event, links);
    const sourceNodeId = link.source.id;
    const targetNodeId = link.target.id;
    highlightLink(link);
    highlightNodeById(sourceNodeId);
    highlightNodeById(targetNodeId);
  };

  // leave link取消高亮
  const linkMouseLeaveHandler = (event: MouseEvent) => {
    const link = findLinkById(event, links);
    const sourceNodeId = link.source.id;
    const targetNodeId = link.target.id;
    unhighlightLink(link);
    unhighlightNodeById(graphData, sourceNodeId);
    unhighlightNodeById(graphData, targetNodeId);
  };

  return (
    <svg width={width} height={height} ref={svgRef}>
      <g className={styles.links} stroke="#999">
        {links.map((link, index: number) => {
          return (
            <ForceLink
              handlers={{
                mouseEnterHandler: linkMouseEnterHandler,
                mouseLeaveHandler: linkMouseLeaveHandler,
              }}
              id={`link${link.source.id}_${link.target.id}`}
              className={styles.link}
              key={index}
              x1={link.source.x as number}
              y1={link.source.y as number}
              x2={link.target.x as number}
              y2={link.target.y as number}
              attributes={{
                strokeWidth: 2,
              }}
            />
          );
        })}
      </g>
      <g className={styles.nodes}>
        {nodes.map((node, index: number) => {
          return (
            <ForceNode
              handlers={{
                mouseEnterHandler: nodeMouseEnterHandler,
                mouseLeaveHandler: nodeMouseLeaveHandler,
              }}
              id={`${getNodeId(node.id)}`}
              className={styles.node}
              key={node.id}
              r={nodeScale(node.expsum)}
              cx={node.x as number}
              cy={node.y as number}
              attributes={{
                fill: getNodeColor(nodes).get(node.continent),
              }}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default React.memo(ForceGraph);

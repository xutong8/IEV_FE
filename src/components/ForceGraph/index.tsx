import {
  processGraphData,
  graphNodeColopMap,
  IGraphNode,
  IGraphLink,
} from "@/utils/processGraphData";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ForceNode from "./ForceNode";
import styles from "./index.less";
import {
  forceSimulation,
  forceLink,
  forceCenter,
  forceCollide,
} from "d3-force";
import { selectAll, select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import ForceLink from "./ForceLink";
import { forceManyBody } from "d3";
import {
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
import Legend from "../Legend";
import { zoom, zoomTransform } from "d3-zoom";

export interface IForceGraphProps {
  width: number | string;
  height: number | string;
}

const ForceGraph: React.FC<IForceGraphProps> = (props) => {
  const { width, height } = props;
  const [year, setYear] = useState<number>(1995);
  const graphData = useMemo(() => processGraphData(year), [year]);
  const { nodes, links, continents } = graphData;

  // nodes的state
  const [nodesState, setNodesState] = useState<IGraphNode[]>(nodes);
  // links的state
  const [linksState, setLinksState] = useState<IGraphLink[]>(links);

  const legendHeight = 125;

  const svgRef = useRef<SVGSVGElement>(null);

  const [computedWidth, computedHeight] = useSVGSize(svgRef);

  // 按照expsum的值来映射节点的半径
  const minNode = useMemo(() => {
    return Math.min(...nodes.map((node) => node.expsum));
  }, [nodes]);
  const maxNode = useMemo(() => {
    return Math.max(...nodes.map((node) => node.expsum));
  }, [nodes]);

  const nodeScale = scaleLinear().domain([minNode, maxNode]).range([3, 12]);

  // 按照value值来映射边的长短
  const minLink = useMemo(() => {
    return Math.min(...links.map((link) => link.value));
  }, [links]);
  const maxLink = useMemo(() => {
    return Math.max(...links.map((link) => link.value));
  }, [links]);

  const linkScale = scaleLinear().domain([minLink, maxLink]).range([4, 8]);

  // 设置布局算法
  const simulation = forceSimulation(nodesState as any)
    .force(
      "link",
      forceLink(linksState as any)
        .id((d: any) => d.id)
        .distance((d) => linkScale((d as any)?.value ?? 1))
    )
    .force("charge", forceManyBody().distanceMax(30))
    .force("collide", forceCollide().radius(5))
    .force("center", forceCenter(computedWidth / 2, computedHeight / 2));

  useEffect(() => {
    simulation.on("tick", () => {
      selectAll(`.${styles.node}`)
        .data(nodesState)
        .attr("cx", (d) => d.x as number)
        .attr("cy", (d) => d.y as number);

      selectAll(`.${styles.link}`)
        .data(linksState)
        .attr("x1", (d) => d.source.x as number)
        .attr("y1", (d) => d.source.y as number)
        .attr("x2", (d) => d.target.x as number)
        .attr("y2", (d) => d.target.y as number);
    });
  }, [simulation, width, height, nodesState, linksState]);

  // enter node高亮
  const nodeMouseEnterHandler = (event: MouseEvent) => {
    const nodeId = (event.target as HTMLElement).id.slice(4);
    highlightNodeById(nodes, nodeId);
  };
  // leave node取消高亮
  const nodeMouseLeaveHandler = (event: MouseEvent) => {
    const nodeId = (event.target as HTMLElement).id.slice(4);
    unhighlightNodeById(graphData, nodeId);
  };

  // enter link高亮
  const linkMouseEnterHandler = (event: MouseEvent) => {
    const link = findLinkById(event, links);
    const sourceNodeId = link.source.id;
    const targetNodeId = link.target.id;
    highlightLink(link);
    highlightNodeById(nodes, sourceNodeId);
    highlightNodeById(nodes, targetNodeId);
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

  // 过滤的列表
  const [filterList, setFilterList] = useState<string[]>([]);
  // 绑定click事件
  const handleClick = (continent: string, state: boolean) => {
    if (state) {
      const newFilterList = [...filterList, continent];
      setFilterList(newFilterList);
      setNodesState(
        nodes.filter((node) => !newFilterList.includes(node.continent))
      );
      setLinksState(
        links.filter(
          (link) =>
            !newFilterList.includes(link.source.continent) &&
            !newFilterList.includes(link.target.continent)
        )
      );
    } else {
      const newFilterList = filterList
        .slice()
        .filter((filter) => filter !== continent);
      setFilterList([...newFilterList]);
      setNodesState(
        nodes.filter((node) => !newFilterList.includes(node.continent))
      );
      setLinksState(
        links.filter(
          (link) =>
            !newFilterList.includes(link.source.continent) &&
            !newFilterList.includes(link.target.continent)
        )
      );
    }
  };

  // 处理zoom事件
  const handleZoom = (event: any) => {
    select("#graphRoot").attr("transform", event.transform);
  };

  useEffect(() => {
    // 支持zoom交互
    const customZoom = zoom().on("zoom", handleZoom) as any;
    select(svgRef.current).call(customZoom);

    return () => {
      customZoom.on("zoom", null);
      select(svgRef.current).call(customZoom);
    };
  }, []);

  return (
    <div className={styles.forceGraph}>
      <div className={styles.legends}>
        <Legend
          orient="row"
          data={continents}
          color={(continent: string) => graphNodeColopMap.get(continent)}
          onClick={handleClick}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        />
      </div>
      <svg width={width} height={height} ref={svgRef}>
        <g id="graphRoot">
          <g className={styles.links} stroke="#999">
            {linksState.map((link, index: number) => {
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
          <g className={styles.nodes} id="forceNodes">
            {nodesState.map((node, index: number) => {
              return (
                <g key={node.id} id={`${getNodeId(node.id)}Group`}>
                  <ForceNode
                    handlers={{
                      mouseEnterHandler: nodeMouseEnterHandler,
                      mouseLeaveHandler: nodeMouseLeaveHandler,
                    }}
                    id={`${getNodeId(node.id)}`}
                    className={styles.node}
                    r={nodeScale(node.expsum)}
                    cx={node.x as number}
                    cy={node.y as number}
                    attributes={{
                      fill: graphNodeColopMap.get(node.continent),
                    }}
                  />
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default React.memo(ForceGraph);

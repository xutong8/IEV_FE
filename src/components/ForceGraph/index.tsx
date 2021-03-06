import { IGraphNode, IGraphLink } from "@/types/forceGraph";
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
  findNodeById,
  getNodeId,
  highlightNodeById,
  unhighlightNodeById,
  updateLabelPos,
} from "@/utils/nodeUtils";
import {
  findLinkById,
  highlightLink,
  unhighlightLink,
} from "@/utils/linkUtils";
import { useSVGSize } from "@/hooks/useSVGSize";
import Legend from "../Legend";
import { zoom } from "d3-zoom";
import { httpRequest } from "@/services";
import { unstable_batchedUpdates } from "react-dom";
import randomcolor from "randomcolor";
import { InputNumber, Slider, Spin } from "antd";
import { isEqual } from "lodash";
import Title from "../Title";
import { continentColorMap } from "@/constants/colorMap";
import { useSelector } from "react-redux";
import { IStore } from "@/reducers";

export interface IForceGraphProps {
  width: number;
  height: number;
  radius: number;
  year: number;
  category: string[];
}

const ForceGraph: React.FC<IForceGraphProps> = (props) => {
  const { width, height, radius, year, category } = props;

  // 节点
  const [graphNodes, setGraphNodes] = useState<IGraphNode[]>([]);
  // 边
  const [graphLinks, setGraphLinks] = useState<IGraphLink[]>([]);

  // nodes的state
  const [nodesState, setNodesState] = useState<IGraphNode[]>([]);
  const nodesStateRef = useRef<IGraphNode[]>([]);

  // links的state
  const [linksState, setLinksState] = useState<IGraphLink[]>([]);
  const linksStateRef = useRef<IGraphLink[]>([]);

  // continents
  const [continents, setContinents] = useState<string[]>([]);
  // colorMap
  const [colorMap, setColorMap] = useState<Map<string, string>>();

  // alphaDecay
  const [alphaDecay, setAlpha] = useState<number>(0.15);
  // velocityDecay
  const [velocityDecay, setVelocity] = useState<number>(0.6);

  // 获取数据
  const fetchData = () => {
    // 如果长度为0，则跳过
    if (category.length === 0) return;

    httpRequest
      .get(`/force_graph?year=${year}&category=${JSON.stringify(category)}`)
      .then((res: any) => {
        const nodes = (res?.data?.nodes ?? []) as IGraphNode[];

        const lastNodes = nodesStateRef.current;

        // 初始化nodes上一轮的位置信息，所以simulation不会重新initialize
        nodes.forEach((node) => {
          const lastNode = lastNodes.find(
            (lastNode) => lastNode.id === node.id
          );
          if (lastNode) {
            node.x = lastNode.x;
            node.y = lastNode.y;
          }
        });

        const links = (res?.data?.links ?? []).map((link: IGraphLink) => {
          return {
            value: link.value,
            source: findNodeById(nodes, link.source.id),
            target: findNodeById(nodes, link.target.id),
          };
        });
        const continentsSet = new Set<string>();
        for (const node of nodes) {
          continentsSet.add(node.continent);
        }
        const continents = Array.from(continentsSet);

        if ((colorMap?.size ?? 0) === 0) {
          const newColorMap = new Map<string, string>();

          continents.forEach((continent, index) => {
            newColorMap.set(continent, continentColorMap[continent]);
          });
          setColorMap(newColorMap);
        }

        nodesStateRef.current = nodes;
        linksStateRef.current = links;

        unstable_batchedUpdates(() => {
          setContinents(continents);
          setGraphNodes(nodes);
          setNodesState(nodes);
          setGraphLinks(links);
          setLinksState(links);
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [year, category]);

  const svgRef = useRef<SVGSVGElement>(null);

  // 按照expsum的值来映射节点的半径
  const minNode = useMemo(() => {
    return Math.min(...graphNodes.map((node) => node.expsum));
  }, [graphNodes]);
  const maxNode = useMemo(() => {
    return Math.max(...graphNodes.map((node) => node.expsum));
  }, [graphNodes]);

  const nodeScale = scaleLinear().domain([minNode, maxNode]).range([3, radius]);

  // 设置布局算法
  const simulation = useMemo(() => {
    return forceSimulation(nodesState as any)
      .alphaDecay(alphaDecay)
      .velocityDecay(velocityDecay)
      .force(
        "link",
        forceLink(linksState as any).id((d: any) => d.id)
      )
      .force("charge", forceManyBody().distanceMax(40))
      .force("collide", forceCollide().radius(12))
      .force("center", forceCenter(width / 2, (height - 50) / 2));
  }, [width, height, nodesState, linksState]);

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
      // 更新位置
      updateLabelPos(countryList);
    });
    // .on("end", () => {
    //   updateLabelPos(countryList);
    // });
  }, [simulation, width, height, nodesState, linksState]);

  // countryList selector
  const countryList = useSelector(
    (state: IStore) => state.countryList,
    (prev, next) => isEqual(prev, next)
  );

  // enter node高亮
  const nodeMouseEnterHandler = (event: MouseEvent) => {
    const nodeId = (event.target as HTMLElement).id.slice(4);
    highlightNodeById(graphNodes, nodeId);
  };
  // leave node取消高亮
  const nodeMouseLeaveHandler = (event: MouseEvent) => {
    const nodeId = (event.target as HTMLElement).id.slice(4);
    unhighlightNodeById(graphNodes, nodeId, colorMap as Map<string, string>);
  };

  // enter link高亮
  const linkMouseEnterHandler = (event: MouseEvent) => {
    const link = findLinkById(event, graphLinks);
    const sourceNodeId = link.source.id;
    const targetNodeId = link.target.id;
    highlightLink(link);
    highlightNodeById(graphNodes, sourceNodeId);
    highlightNodeById(graphNodes, targetNodeId);
  };

  // leave link取消高亮
  const linkMouseLeaveHandler = (event: MouseEvent) => {
    const link = findLinkById(event, graphLinks);
    const sourceNodeId = link.source.id;
    const targetNodeId = link.target.id;
    unhighlightLink(link);
    unhighlightNodeById(
      graphNodes,
      sourceNodeId,
      colorMap as Map<string, string>
    );
    unhighlightNodeById(
      graphNodes,
      targetNodeId,
      colorMap as Map<string, string>
    );
  };

  // 过滤的列表
  const [filterList, setFilterList] = useState<string[]>([]);
  // 绑定click事件
  const handleClick = (continent: string, state: boolean) => {
    if (state) {
      const newFilterList = [...filterList, continent];
      setFilterList(newFilterList);
      setNodesState(
        graphNodes.filter((node) => !newFilterList.includes(node.continent))
      );
      setLinksState(
        graphLinks.filter(
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
        graphNodes.filter((node) => !newFilterList.includes(node.continent))
      );
      setLinksState(
        graphLinks.filter(
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

  // 处理alphaDecay值改变
  const onChangeAlpha = (value: number) => {
    setAlpha(value);
  };
  // 处理velocityDecay值改变
  const onChangeVelocity = (value: number) => {
    setVelocity(value);
  };

  // zoom ref
  const zoomRef = useRef<any>(null);

  useEffect(() => {
    // 支持zoom交互
    const customZoom = zoom().on("zoom", handleZoom) as any;
    zoomRef.current = customZoom;
    select(svgRef.current).call(customZoom);

    return () => {
      customZoom.on("zoom", null);
      select(svgRef.current).call(customZoom);
    };
  }, []);

  useEffect(() => {
    zoomRef.current.scaleTo(select(svgRef.current), 0.65);
    zoomRef.current.translateBy(select(svgRef.current), 50, 20);
  }, []);

  // 更新标签位置
  // useEffect(() => {
  //   console.log("okk");
  //   console.log(nodesState);
  //   updateLabelPos(countryList);
  // }, [nodesState, countryList]);

  return (
    <div className={styles.forceGraph}>
      <Title title="Industrial Structure"></Title>
      <div className={styles.content}>
        <Spin spinning={category.length === 0} wrapperClassName={styles.spin}>
          <div className={styles.legends}>
            <Legend
              orient="row"
              data={continents}
              color={(continent: string) => colorMap?.get(continent) ?? ""}
              onClick={handleClick}
            />
          </div>
          <div className={styles.configMenu}>
            <div className={styles.configItem}>
              <div className={styles.label}>Time</div>
              <Slider
                className={styles.slider}
                min={0}
                max={1}
                onChange={onChangeAlpha}
                value={alphaDecay}
                step={0.01}
              />
              <InputNumber
                min={0}
                max={1}
                // style={{ margin: "0 16px" }}
                step={0.01}
                value={alphaDecay}
                onChange={onChangeAlpha}
              />
            </div>
            <div className={styles.configItem}>
              <div className={styles.label}>Velocity</div>
              <Slider
                className={styles.slider}
                min={0}
                max={1}
                onChange={onChangeVelocity}
                value={velocityDecay}
                step={0.01}
              />
              <InputNumber
                min={0}
                max={1}
                // style={{ margin: "0 16px" }}
                step={0.01}
                value={velocityDecay}
                onChange={onChangeVelocity}
              />
            </div>
          </div>
          <svg
            width={width}
            // 总高为80，其中legend高度为50，title高度为30, configMenu高度为154
            height={height - 154 >= 0 ? height - 154 : 0}
            ref={svgRef}
          >
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
                        strokeWidth: 1,
                        strokeOpacity: 0.86,
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
                          fill: colorMap?.get(node.continent) ?? "",
                          fillOpacity: 0.6,
                          stroke: colorMap?.get(node.continent) ?? "",
                        }}
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
        </Spin>
      </div>
    </div>
  );
};

export default React.memo(ForceGraph, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
);

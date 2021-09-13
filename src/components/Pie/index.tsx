import { pie, arc } from "d3";
import Wedge from "./Wedge";
import { IItemPieData, pieData, selectCountries } from "@/utils/processPieData";
import { useMemo, useRef } from "react";
import { useSVGSize } from "@/hooks/useSVGSize";

export interface IPie {
  width: number | string;
  height: number | string;
}

export interface IPieData {
  data: IItemPieData;
  endAngle: number;
  index: number;
  padAngle: number;
  startAngle: number;
  value: number;
}

const Pie: React.FC<IPie> = (prop) => {
  const { width, height } = prop;

  const data = useMemo(() => pieData, [pieData]);

  const svgRef = useRef<SVGSVGElement>(null);

  // 计算出来的宽度和高度
  const [computedWidth, computedHeight] = useSVGSize(svgRef);

  const [innerRadius, outerRadius] = useMemo(() => {
    const radius = Math.min(computedWidth - 20, computedHeight - 20) / 2;
    return [radius * 0.75, radius - 10];
  }, [computedWidth, computedHeight]);

  const pieDrawData = useMemo(
    () =>
      pie<IItemPieData>()
        .padAngle(0.01)
        .value((d) => d.value)
        .sort(null)(data),
    [data]
  );
  // sort
  const arcData = useMemo(
    () => arc<IPieData>().innerRadius(innerRadius).outerRadius(outerRadius),
    [innerRadius, outerRadius]
  );
  const translation = useMemo(
    () => `translate(${computedWidth / 2}, ${computedHeight / 2})`,
    [computedWidth, computedHeight]
  );

  return (
    <svg width={width} height={height} ref={svgRef}>
      <g transform={translation}>
        {pieDrawData.map((item, index) => {
          const itemCenter = arcData.centroid(item);
          return (
            <g key={item.index}>
              <Wedge
                d={arcData(item)}
                fill={
                  item.data.country === selectCountries[0]
                    ? "#508bbb"
                    : "#d2796f"
                }
              />
              <text
                x={itemCenter[0]}
                y={itemCenter[1]}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                textAnchor="middle"
                transform={`rotate(${
                  (180 * (item.startAngle + item.endAngle)) / 2 / Math.PI
                }) translate(10, -18)`}
              >
                {item.data.type}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default Pie;

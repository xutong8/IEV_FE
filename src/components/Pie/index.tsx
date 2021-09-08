import { pie, arc } from "d3";
import Wedge from "./Wedge";
import { IItemPieData, pieData, selectCountries } from "@/utils/processPieData";
import { useMemo } from "react";

export interface IPie {
  width: number;
  height: number;
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
  const [innerRadius, outerRadius] = useMemo(() => {
    const radius = Math.min(width - 20, height - 20) / 2;
    return [radius * 0.75, radius - 10];
  }, [width, height]);

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
    () => `translate(${width / 2}, ${height / 2})`,
    [width, height]
  );

  return (
    <svg width={width} height={height}>
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

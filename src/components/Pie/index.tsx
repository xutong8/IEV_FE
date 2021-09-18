import { pie, arc } from "d3";
import Wedge from "./Wedge";
import { IItemPieData, pieData, selectCountries } from "@/utils/processPieData";
import { useMemo, useRef } from "react";
import Tooltip from "@/components/Tooltip";

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

const Pie: React.FC<IPie> = (props) => {
  const { width, height } = props;

  const toolTipRef = useRef<any>();

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

  console.log("update");

  // // tooltip hook
  // const [show, onMouseMove, onMouseLeave, Tooltip] = useTooltip({htmlTemplate: () => 'tooltip'})
  console.log("update");
  return (
    <>
      <Tooltip ref={toolTipRef}>
        {({ country, type, value }: any) =>
          `<div>${country} ${type} </div><div>value: ${value}</div>`
        }
      </Tooltip>
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
                  tipMessage={item}
                  onMouseMove={(e: any) =>
                    toolTipRef.current.onMouseMove(e, item.data)
                  }
                  onMouseLeave={() => toolTipRef.current.onMouseLeave()}
                />
                <text
                  x={itemCenter[0]}
                  y={itemCenter[1]}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
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
    </>
  );
};

export default Pie;

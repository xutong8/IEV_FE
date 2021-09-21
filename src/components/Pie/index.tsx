import { pie, arc } from "d3";
import Wedge from "./Wedge";
import { IItemPieData, pieData, selectCountries } from "@/utils/processPieData";
import { useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "@/components/Tooltip";
import { reqDonutChartData } from "@/services/api";

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
  const [data, setData] = useState<any>();

  const handleData = async () => {
    const res: any = await reqDonutChartData({
      year: "2019",
      category: ["1", "2", "3", "4", "5", "6", "7"],
      countries: ["842", "156"],
    });
    console.log(res.data);
    setData(res.data);
  };

  useEffect(() => {
    handleData();
  }, []);

  const [innerRadius, outerRadius] = useMemo(() => {
    const radius = Math.min(width - 20, height - 20) / 2;
    return [radius * 0.75, radius - 10];
  }, [width, height]);

  const pieDrawData = useMemo(
    () =>
      data
        ? pie<IItemPieData>()
            .padAngle(0.01)
            .value((d) => d.value)
            .sort(null)(data)
        : undefined,
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
    <>
      <Tooltip ref={toolTipRef}>
        {({ country, type, value }: any) =>
          `<div>${country} ${type} </div><div>value: ${value}</div>`
        }
      </Tooltip>
      <svg width={width} height={height}>
        <g transform={translation}>
          {pieDrawData?.map((item: any, index: number) => {
            const itemCenter = arcData.centroid(item);
            const d = arcData(item)?.toString();
            const firstArcSection = /(^.+?)L/;

            let newArc = firstArcSection.exec(d)[1];

            newArc = newArc.replace(/,/g, " ");

            return (
              <g key={item.index}>
                <Wedge
                  id={`arc${item.index}`}
                  d={d}
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
                <path
                  id={`donutArc${item.index}`}
                  d={newArc}
                  style={{ fill: "none" }}
                />
                {/* {item.endAngle - item.startAngle > 0.6 && (
                  <text
                    x={itemCenter[0]}
                    y={itemCenter[1]}
                    dominantBaseline="central"
                    textAnchor="middle"
                    transform={`rotate(${
                      (180 * (item.startAngle + item.endAngle)) / 2 / Math.PI
                    }, ${itemCenter[0]}, ${itemCenter[1]}) translate(0, -18)`}
                  >
                    {item.data.type}
                  </text>
                )} */}
                <text>
                  <textPath
                    xlinkHref={`#donutArc${item.index}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {item.data.type}
                  </textPath>
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

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
  data: any; // IItemPieData;
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
        {({ country, type_name, value }: any) =>
          `<div>${country} ${type_name} </div><div>value: ${value.toFixed(
            2
          )}</div>`
        }
      </Tooltip>
      <svg width={width} height={height}>
        <g transform={translation}>
          {pieDrawData?.map((item: IPieData, index: number) => {
            const d = arcData(item);
            const firstArcSection = /(.+?)L/;
            const newArc = d?.match(firstArcSection)![1];
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
                  onMouseMove={(e: any) =>
                    toolTipRef.current.onMouseMove(e, {
                      name: `${item.data.country} ${item.data.type_name}`,
                      value: item.data.value,
                    })
                  }
                  onMouseLeave={() => toolTipRef.current.onMouseLeave()}
                />
                <path
                  id={`donutArc${item.index}`}
                  d={newArc}
                  style={{ fill: "none" }}
                />
                <text>
                  <textPath
                    xlinkHref={`#donutArc${item.index}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {item.data.type_name}
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

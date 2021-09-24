import { pie, arc } from "d3";
import Wedge from "./Wedge";
import { IItemPieData } from "@/utils/processPieData";
import { useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "@/components/Tooltip";
import { reqDonutChartData } from "@/services/api";
import { useSelector } from "react-redux";
import { isEqual } from "lodash";
import { IStore } from "@/reducers";
import { findCountryIdByName } from "@/utils/findCountryIdByName";

export interface IPie {
  width: number;
  height: number;
  sourceCountry: string;
  targetCountry: string;
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
  const { width, height, sourceCountry, targetCountry } = props;

  const toolTipRef = useRef<any>();
  const [data, setData] = useState<any>();

  const { year, category } = useSelector(
    (state: IStore) => ({
      year: state.year,
      category: state.categoryObj.selectedCategory.map((item) => item.id),
    }),
    (prev, next) => isEqual(prev, next)
  );

  const handleData = async () => {
    // 如果category长度为0，则跳过
    if (category.length === 0) return;

    const res: any = await reqDonutChartData({
      year,
      category,
      countries: [
        findCountryIdByName(sourceCountry),
        findCountryIdByName(targetCountry),
      ],
    });

    setData(res.data);
  };

  useEffect(() => {
    handleData();
  }, [year, category, sourceCountry, targetCountry]);

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
                    item.data.country === targetCountry ? "#508bbb" : "#d2796f"
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

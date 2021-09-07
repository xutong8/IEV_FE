import { pie, arc } from "d3";
import Wedge from "./Wedge";

export interface IPie {
  innerRadius: number;
  outerRadius: number;
  padRadius: number;
  width: number;
  height: number;
  data: any;
}

const Pie: React.FC<IPie> = (prop) => {
  const { data, innerRadius, outerRadius, padRadius, width, height } = prop;
  const pieData = pie()(data);
  // sort
  const arcData = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padRadius(padRadius);
  const translation = `translate(${innerWidth / 2}, ${innerHeight / 2})`;

  return (
    <svg width={width} height={height}>
      {/* <g>
                {
                    pieData.map((item, index) => (
                        <Wedge
                            key={item.toString()}
                            d={arcData(item)}
                            fill={colorScale(e.data)}
                        />
                    ))
                }
            </g> */}
    </svg>
  );
};

export default Pie;

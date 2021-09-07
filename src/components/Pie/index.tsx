import { pie, arc } from "d3";

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
  const arcData = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padRadius(padRadius);
  // sort
  return (
    <svg>
      <g />
    </svg>
  );
};

export default Pie;

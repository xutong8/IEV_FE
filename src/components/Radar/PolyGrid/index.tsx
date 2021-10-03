import { useEffect, useRef, useState } from "react";

export interface IPolyGrid {
  sides: number;
  level: number;
  width: number;
  height: number;
}

// TODO
const PolyGrid: React.FC<IPolyGrid> = (props) => {
  const { sides, level, width, height } = props;
  const size = Math.min(width, height);
  const offset = Math.PI;
  const polyangle = (Math.PI * 2) / sides;
  const r = 0.8 * size;
  const r_0 = r / 2;
  const center = {
    x: size / 2,
    y: size / 2,
  };

  const [paths, setPaths] = useState<Array<string>>();

  const generatePoint = ({ length, angle }: any) => {
    const point = {
      x: center.x + length * Math.sin(offset - angle),
      y: center.y + length * Math.cos(offset - angle),
    };
    return point;
  };

  const drawPath = (points: Array<any>) => {
    // draw points
    console.log(points);
    let pathD = "";
    points.forEach((point, index) => {
      if (index == 0) {
        pathD += `M${point.x} ${point.y} `;
      } else {
        pathD += `L${point.x} ${point.y} `;
      }
    });
    pathD += "Z";

    return pathD;
  };

  const generateAndDrawLevels = (levelsCount: number, sideCount: number) => {
    let pathAray = [];
    for (let level = 1; level <= levelsCount; level++) {
      const hyp = (level / levelsCount) * r_0;

      const points = [];
      for (let vertex = 0; vertex < sideCount; vertex++) {
        const theta = vertex * polyangle;

        points.push(generatePoint({ length: hyp, angle: theta }));
      }

      pathAray.push(drawPath([...points]));
    }
    setPaths(pathAray);
  };

  useEffect(() => {
    generateAndDrawLevels(level, sides);
  }, []);

  return (
    <g className="polygrid">
      {paths?.map((d, index) => (
        <path key={index} d={d} fill="none" stroke="black" strokeWidth={2} />
      ))}
    </g>
  );
};

export default PolyGrid;

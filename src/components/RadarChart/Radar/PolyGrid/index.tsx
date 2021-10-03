import { useEffect, useMemo, useRef, useState } from "react";

export interface IPolyGrid {
  sides: number;
  level: number;
  width: number;
  height: number;
  r: number;
  r_0: number;
  size: number;
  center: {
    x: number;
    y: number;
  };
  generatePoint: any;
  drawPath: any;
}

// TODO
const PolyGrid: React.FC<IPolyGrid> = (props) => {
  const {
    sides,
    level,
    width,
    height,
    r,
    r_0,
    size,
    center,
    generatePoint,
    drawPath,
  } = props;
  //   const size = useMemo(() => Math.min(width, height), [width, height]);

  const polyangle = (Math.PI * 2) / sides;
  //   const r = 0.8 * size;
  //   const r_0 = r / 2;

  const paths: Array<string> = [];
  const lines: Array<string> = [];

  const generateAndDrawLevels = (levelsCount: number, sideCount: number) => {
    for (let level = 1; level <= levelsCount; level++) {
      const hyp = (level / levelsCount) * r_0;

      const points = [];
      for (let vertex = 0; vertex < sideCount; vertex++) {
        const theta = vertex * polyangle;
        points.push(generatePoint({ length: hyp, angle: theta }));
      }

      paths.push(drawPath([...points]));
    }
  };

  const generateAndDrawLines = (sideCount: number) => {
    for (let vertex = 1; vertex <= sideCount; vertex++) {
      const theta = vertex * polyangle;
      const point = generatePoint({ length: r_0, angle: theta });

      lines.push(drawPath([center, point]));
    }
  };

  generateAndDrawLevels(level, sides);
  generateAndDrawLines(sides);

  return (
    <g className="polygrid">
      {paths?.map((d, index) => (
        <path key={index} d={d} fill="none" stroke="black" strokeWidth={1} />
      ))}
      {lines?.map((d, index) => (
        <path key={index} d={d} fill="none" stroke="black" strokeWidth={1} />
      ))}
    </g>
  );
};

export default PolyGrid;

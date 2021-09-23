import { RefObject, useEffect, useState } from "react";

const useSVGSize = (ref: RefObject<Element>) => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const svgDom = ref.current;
    const size = svgDom?.getBoundingClientRect();
    setWidth(size?.width ?? 0);
    setHeight(size?.height ?? 0);
  }, []);

  return [width, height];
};

export { useSVGSize };

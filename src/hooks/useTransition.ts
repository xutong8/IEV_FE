import { useState, useEffect } from "react";
import { selectAll } from "d3-selection";

// 默认的过渡时间
const DEFAULT_TRANSITION_DURATION = 800;

const useTransition: (props: {
  className: string;
  value: any[] | any;
  deps?: any[];
  intial?: any;
  duration?: number;
  easingFunction?: any;
}) => any = ({
  className = "",
  value = [],
  deps = [],
  intial = null,
  duration = null,
  easingFunction = null,
}) => {
  const [attrState, setAttrState] = useState(intial || value);

  const executeTransition = () => {
    if (!className) return;
    if (value && value.length <= 0) return;

    const elements = selectAll(`.${className}`);

    const transitions = elements
      .transition()
      .duration(
        typeof duration === "number" ? duration : DEFAULT_TRANSITION_DURATION
      );

    easingFunction && transitions.ease(easingFunction);

    const attrNames = Object.keys(attrState[0]);

    attrNames.forEach((attrName) => {
      transitions.each((d, index: number, nodes) => {
        transitions
          .filter((d, idx: number) => index === idx)
          .attr(attrName, value[index][attrName]);
      });
    });

    transitions.on("end", () => {
      setAttrState(value);
    });

    return () => elements.interrupt() as any;
  };

  useEffect(executeTransition, [...deps]);

  return {
    attrState,
  };
};

export { useTransition };

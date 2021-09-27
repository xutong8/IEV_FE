import { useState, useEffect } from "react";
import { selectAll } from "d3-selection";

// 默认的过渡时间
const DEFAULT_TRANSITION_DURATION = 800;

const useTransition: (props: {
  className: string;
  value: any[];
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
  const [attrState, setAttrState] = useState<any>(intial || value);

  const executeTransition = () => {
    if (!className) return;

    const elements = selectAll(`.${className}`);

    const transitions = elements
      .transition()
      .duration(
        typeof duration === "number" ? duration : DEFAULT_TRANSITION_DURATION
      );

    easingFunction && transitions.ease(easingFunction);

    if (attrState.length !== 0) {
      const attrNames = Object.keys(attrState[0]);

      attrNames.forEach((attrName) => {
        transitions.each((d, index: number) => {
          transitions
            .filter((d, idx: number) => index === idx)
            .attr(attrName, value[index][attrName]);
        });
      });
    } else {
      // Fix: 如果attrState为空，则无法触发transition，所以无法更新状态，
      // 因此当attrState为空时，直接setState
      setAttrState(value);
    }

    transitions.on("end", () => {
      setAttrState(value);
    });

    return () => elements.interrupt() as any;
  };

  useEffect(executeTransition, deps);

  return {
    attrState,
    setAttrState,
  };
};

export { useTransition };

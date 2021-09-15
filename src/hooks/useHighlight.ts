import { useEffect } from "react";
import { select } from "d3-selection";

export interface IHandlers {
  mouseEnterHandler: (event: MouseEvent) => void;
  mouseLeaveHandler: (event: MouseEvent) => void;
}

const useHighlight: (
  sourceId: string,
  needHighlight: boolean,
  handlers: IHandlers
) => void = (sourceId, needHighlight = false, handlers) => {
  useEffect(() => {
    if (needHighlight) {
      select(`#${sourceId}`)
        .on("mouseenter", (dom) => handlers.mouseEnterHandler(dom))
        .on("mouseleave", (dom) => handlers.mouseLeaveHandler(dom));
    } else {
      select(`#${sourceId}`).on("mouseenter", null).on("mouseleave", null);
    }

    return () => {
      select(`#${sourceId}`).on("mouseenter", null).on("mouseleave", null);
    };
  }, [needHighlight, handlers, sourceId]);
};

export { useHighlight };

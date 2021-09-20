import { useState, useRef } from "react";

const useTooltip: (props: {
  htmlTemplate: (...params: Array<string>) => string;
}) => any = ({ htmlTemplate }) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<any>(document.createElement("div"));

  const onMouseMove = (evt: any, messages: any) => {
    evt.preventDefault();
    if (!show) {
      setShow(true);
    }
    const { clientX, clientY } = evt;
    tooltipRef.current.style.position = "fixed";
    tooltipRef.current.style.left = `${clientX}px`;
    tooltipRef.current.style.top = `${clientY}px`;
    tooltipRef.current.innerText = "tooltip";
  };

  const onMouseLeave = () => {
    setShow(false);
  };

  const Tooltip = tooltipRef.current;

  return [show, onMouseMove, onMouseLeave, Tooltip];
};

export { useTooltip };

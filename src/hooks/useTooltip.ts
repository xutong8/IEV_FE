import { useState, useRef, createElement, ReactPortal } from "react";
import Tooltip from "@/components/Tooltip";
import ReactDOM from "react-dom";

// TODO: SingleTon tooltip
const useTooltip: (props: {
  htmlTemplate: (...params: Array<string>) => string;
}) => any = ({ htmlTemplate }) => {
  // hoverState
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

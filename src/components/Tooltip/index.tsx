import React, { useState, useRef, useImperativeHandle } from "react";
import styles from "./index.less";

export interface ITooltipContent {
  name: string;
  value: string;
}

const Tooltip: React.FC<any> = React.forwardRef((props, ref) => {
  // hoverState
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<ITooltipContent>({
    name: "",
    value: "",
  });
  const tooltipRef = useRef<any>();
  const offset = { top: -65 };

  const renderContent = ({ name, value }: ITooltipContent) => {
    return (
      <div>
        {name}: <br />
        {value}
      </div>
    );
  };

  useImperativeHandle(ref, () => ({
    onMouseMove: (evt: any, messages: any) => {
      evt.preventDefault();
      if (!show) {
        setShow(true);
      }
      const { clientX, clientY } = evt;

      tooltipRef.current.style.left = `${clientX}px`;
      tooltipRef.current.style.top = `${clientY + offset.top}px`;
      setMessage(messages);
      // htmlTemplate
      // // 处理显示文本， 以及处理定位信息
      // tooltipRef.current;
    },
    onMouseLeave: () => {
      setShow(false);
    },
  }));

  return (
    <div
      className={styles.tooltip}
      ref={tooltipRef}
      style={show ? { display: "block" } : { display: "none" }}
    >
      {renderContent(message)}
    </div>
  );
});

export default Tooltip;

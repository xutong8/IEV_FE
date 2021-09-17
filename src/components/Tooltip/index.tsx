import React, { useState, useRef, useImperativeHandle } from "react";
import styles from "./index.less";

const Tooltip: React.FC<any> = React.forwardRef((props, ref) => {
  // hoverState
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<any>();
  const offset = { top: -20 };

  useImperativeHandle(ref, () => ({
    onMouseMove: (evt: any, messages: any) => {
      evt.preventDefault();
      if (!show) {
        setShow(true);
      }
      const { clientX, clientY } = evt;
      console.log(props.children, messages);
      tooltipRef.current.style.display = "block";
      tooltipRef.current.style.left = `${clientX}px`;
      tooltipRef.current.style.top = `${clientY + offset.top}px`;
      console.log(props.children(messages));
      tooltipRef.current.innerHTML = props.children(messages); // htmlTemplate()
      // htmlTemplate
      // // 处理显示文本， 以及处理定位信息
      // tooltipRef.current;
    },
    onMouseLeave: () => {
      tooltipRef.current.style.display = "none";
    },
  }));

  return <div className={styles.tooltip} ref={tooltipRef} />;
});

export default Tooltip;

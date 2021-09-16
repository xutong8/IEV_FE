import React, { useState, useRef, useImperativeHandle } from "react";

const Tooltip: React.FC<any> = React.forwardRef((props, ref) => {
  // hoverState
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<any>();

  // const onMouseMove = (evt: any, messages: any) => {
  //     evt.preventDefault();
  //     if (!show) {
  //         setShow(true)
  //     }
  //     const {clientX, clientY} = evt
  //     console.log(tooltipRef, Tooltip)
  //     tooltipRef.current.style.position = 'fixed'
  //     tooltipRef.current.style.left = `${clientX}px`
  //     tooltipRef.current.style.top = `${clientY}px`
  //     tooltipRef.current.innerText = 'tooltip'// htmlTemplate()
  //     // htmlTemplate
  //     // // 处理显示文本， 以及处理定位信息
  //     // tooltipRef.current;
  // }

  // const onMouseLeave = () => {
  //     console.log('leave')
  //     setShow(false)
  // }

  useImperativeHandle(ref, () => ({
    onMouseMove: (evt: any, messages: any) => {
      evt.preventDefault();
      if (!show) {
        setShow(true);
      }
      const { clientX, clientY } = evt;
      console.log(tooltipRef, Tooltip);
      tooltipRef.current.style.position = "fixed";
      tooltipRef.current.style.left = `${clientX}px`;
      tooltipRef.current.style.top = `${clientY}px`;
      tooltipRef.current.innerText = "tooltip"; // htmlTemplate()
      // htmlTemplate
      // // 处理显示文本， 以及处理定位信息
      // tooltipRef.current;
    },
    onMouseLeave: () => {
      console.log("leave");
      setShow(false);
    },
  }));

  return <div ref={tooltipRef} />;
});

export default Tooltip;

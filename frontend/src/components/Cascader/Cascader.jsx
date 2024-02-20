import { Cascader as CascaderComponent } from "antd";
import React, { forwardRef } from "react";

const Cascader = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <CascaderComponent {...props} />
    </div>
  );
});

export default Cascader;

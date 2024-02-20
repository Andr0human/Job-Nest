import React, { forwardRef } from "react";
import { Radio } from "antd";

const RadioGroup = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <Radio.Group {...props} />
    </div>
  );
});

export default RadioGroup;

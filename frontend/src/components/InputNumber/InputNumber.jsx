import React, { forwardRef } from "react";
import { InputNumber as InputNumberComponent } from "antd";

const InputNumber = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <InputNumberComponent {...props} />
    </div>
  );
});

export default InputNumber;

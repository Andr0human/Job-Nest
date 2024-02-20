import React, { forwardRef } from "react";
import { Input as InputComponent } from "antd";

const Input = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <InputComponent {...props} />
    </div>
  );
});

export default Input;

import React, { forwardRef } from "react";
import { Select as SelectComponent } from "antd";

const Select = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <SelectComponent {...props} />
    </div>
  );
});

export default Select;

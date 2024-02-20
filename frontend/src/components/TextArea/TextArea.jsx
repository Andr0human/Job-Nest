import React, { forwardRef } from "react";
import { Input } from "antd";

const TextArea = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <Input.TextArea {...props} />
    </div>
  );
});

export default TextArea;

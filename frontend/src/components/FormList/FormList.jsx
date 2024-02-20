import React, { forwardRef } from "react";
import { Form } from "antd";

const FormList = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <Form.List {...props} />
    </div>
  );
});

export default FormList;

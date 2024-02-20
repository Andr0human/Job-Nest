import React, { forwardRef } from "react";
import { Form } from "antd";

const FormItem = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <Form.Item {...props} />
    </div>
  );
});

export default FormItem;

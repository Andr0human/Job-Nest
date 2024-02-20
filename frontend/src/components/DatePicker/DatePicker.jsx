import React, { forwardRef } from "react";
import { DatePicker as DatePickerComponent } from "antd";

const DatePicker = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <DatePickerComponent {...props} />
    </div>
  );
});

export default DatePicker;

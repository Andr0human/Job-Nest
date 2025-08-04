import { DatePicker as DatePickerComponent } from 'antd';
import { forwardRef } from 'react';

const DatePicker = forwardRef((props, ref) => (
  <DatePickerComponent {...props} ref={ref} />
));

DatePicker.displayName = 'DatePicker';

export default DatePicker;

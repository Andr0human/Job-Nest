import { InputNumber as InputNumberComponent } from 'antd';
import { forwardRef } from 'react';

const InputNumber = forwardRef((props, ref) => (
  <InputNumberComponent {...props} ref={ref} />
));

InputNumber.displayName = 'InputNumber';

export default InputNumber;

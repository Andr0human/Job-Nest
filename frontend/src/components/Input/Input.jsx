import { Input as InputComponent } from 'antd';
import { forwardRef } from 'react';

const Input = forwardRef((props, ref) => (
  <InputComponent {...props} ref={ref} />
));

Input.displayName = 'Input';

export default Input;

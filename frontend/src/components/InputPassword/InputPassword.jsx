import { Input } from 'antd';
import { forwardRef } from 'react';

const InputPassword = forwardRef((props, ref) => (
  <Input.Password {...props} ref={ref} />
));

InputPassword.displayName = 'InputPassword';

export default InputPassword;

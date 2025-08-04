import { Button as ButtonComponent } from 'antd';
import { forwardRef } from 'react';

const Button = forwardRef((props, ref) => (
  <ButtonComponent {...props} ref={ref} />
));

Button.displayName = 'Button';

export default Button;

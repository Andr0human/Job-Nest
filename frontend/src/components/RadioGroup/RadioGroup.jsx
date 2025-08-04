import { Radio } from 'antd';
import { forwardRef } from 'react';

const RadioGroup = forwardRef((props, ref) => (
  <Radio.Group {...props} ref={ref} />
));

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;

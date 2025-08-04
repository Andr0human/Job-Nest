import { Select as SelectComponent } from 'antd';
import { forwardRef } from 'react';

const Select = forwardRef((props, ref) => (
  <SelectComponent {...props} ref={ref} />
));

Select.displayName = 'Select';

export default Select;

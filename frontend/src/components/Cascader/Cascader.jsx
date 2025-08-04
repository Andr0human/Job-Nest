import { Cascader as CascaderComponent } from 'antd';
import { forwardRef } from 'react';

const Cascader = forwardRef((props, ref) => (
  <CascaderComponent {...props} ref={ref} />
));

Cascader.displayName = 'Cascader';

export default Cascader;

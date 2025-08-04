import { Input } from 'antd';
import { forwardRef } from 'react';

const TextArea = forwardRef((props, ref) => (
  <Input.TextArea {...props} ref={ref} />
));

TextArea.displayName = 'TextArea';

export default TextArea;

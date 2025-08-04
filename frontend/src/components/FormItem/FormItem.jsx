import { Form } from 'antd';
import { forwardRef } from 'react';

const FormItem = forwardRef((props, ref) => <Form.Item {...props} ref={ref} />);

FormItem.displayName = 'FormItem';

export default FormItem;

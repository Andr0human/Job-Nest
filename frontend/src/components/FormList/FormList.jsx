import { Form } from 'antd';
import { forwardRef } from 'react';

const FormList = forwardRef((props, _ref) => <Form.List {...props} />);

FormList.displayName = 'FormList';

export default FormList;

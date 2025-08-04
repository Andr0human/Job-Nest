import { Form as FormComponent } from 'antd';
import { forwardRef } from 'react';

const Form = forwardRef((props, ref) => <FormComponent {...props} ref={ref} />);

Form.displayName = 'Form';

export default Form;

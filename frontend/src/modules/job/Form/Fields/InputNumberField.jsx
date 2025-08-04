import PropTypes from 'prop-types';

import { Col, FormItem, InputNumber } from '../../../../components';
import '../form.css';

const InputNumberField = props => {
  const {
    name,
    label,
    placeholder,
    prefix,
    suffix,
    required = false,
    ...rest
  } = props;

  return (
    <Col lg={12} md={12} xs={24}>
      <FormItem
        name={name}
        label={label}
        rules={
          required
            ? [
                {
                  required: true,
                  message: `Please enter ${label.toLowerCase()}`,
                },
              ]
            : []
        }
      >
        <InputNumber
          className='form-input-number'
          placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
          prefix={prefix}
          suffix={suffix}
          style={{ width: '100%' }}
          {...rest}
        />
      </FormItem>
    </Col>
  );
};

InputNumberField.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  required: PropTypes.bool,
};

export default InputNumberField;

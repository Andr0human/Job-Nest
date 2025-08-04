import PropTypes from 'prop-types';

import { FormItem, Input } from '../../../../components';

const InputField = props => {
  const {
    name,
    label,
    required = false,
    placeholder,
    type = 'text',
    ...rest
  } = props;

  return (
    <FormItem
      name={name}
      label={label}
      rules={
        required
          ? [
              {
                required: true,
                message: `Please enter ${label}`,
              },
            ]
          : []
      }
      {...rest}
    >
      <Input
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
        type={type}
      />
    </FormItem>
  );
};

InputField.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

export default InputField;

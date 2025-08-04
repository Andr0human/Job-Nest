import PropTypes from 'prop-types';

import { DatePicker, FormItem } from '../../../../components';

const DatePickerField = props => {
  const { name, label, required = false, placeholder, ...rest } = props;

  return (
    <FormItem
      name={name}
      label={label}
      rules={
        required
          ? [
              {
                required: true,
                message: `Please select ${label.toLowerCase()}`,
              },
            ]
          : []
      }
      {...rest}
    >
      <DatePicker
        placeholder={placeholder || `Select ${label.toLowerCase()}...`}
        style={{ width: '100%' }}
      />
    </FormItem>
  );
};

DatePickerField.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default DatePickerField;

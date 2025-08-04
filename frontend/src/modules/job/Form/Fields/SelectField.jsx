import PropTypes from 'prop-types';

import { Col, FormItem, Select } from '../../../../components';

const SelectField = props => {
  const {
    name,
    label,
    options,
    required = false,
    placeholder,
    ...rest
  } = props;

  const selectOptions = options.map(value => ({
    label: value,
    value,
    desc: value,
  }));

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
                  message: `Please select ${label.toLowerCase()}`,
                },
              ]
            : []
        }
        {...rest}
      >
        <Select
          options={selectOptions}
          dropdownStyle={{ textAlign: 'center' }}
          placeholder={placeholder || `Select ${label.toLowerCase()}...`}
        />
      </FormItem>
    </Col>
  );
};

SelectField.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default SelectField;

import PropTypes from 'prop-types';

import { Cascader, Col, FormItem } from '../../../../components';

const CascaderField = props => {
  const {
    name,
    label,
    options,
    required = false,
    placeholder,
    ...rest
  } = props;

  const selectOptions = Object.values(options).map(({ state, cities }) => ({
    label: state,
    value: state,
    desc: state,
    children: cities.map(city => ({ label: city, value: city, desc: city })),
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
        <Cascader
          options={selectOptions}
          dropdownStyle={{ textAlign: 'center' }}
          placeholder={placeholder || `Select ${label.toLowerCase()}...`}
        />
      </FormItem>
    </Col>
  );
};

CascaderField.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      state: PropTypes.string,
      cities: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default CascaderField;

import PropTypes from 'prop-types';

import { Col, FormItem, RadioGroup } from '../../../../components';

const radioOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const RadioField = props => {
  const { name, label, required = true, ...rest } = props;

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
        <RadioGroup options={radioOptions} />
      </FormItem>
    </Col>
  );
};

RadioField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
};

export default RadioField;

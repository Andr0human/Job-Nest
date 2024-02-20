import React from "react";
import PropTypes from "prop-types";
import { Col, FormItem, InputNumber } from "../../../../components";
import "../form.css";

const InputNumberField = (props) => {
  const { name, label, placeholder, prefix, suffix } = props;

  return (
    <Col lg={12} md={8} xs={24}>
      <FormItem name={name} label={label}>
        <InputNumber
          className="form-input-number"
          placeholder={`${placeholder}...`}
          prefix={prefix}
          suffix={suffix}
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
  placeholder: PropTypes.string.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
};

export default InputNumberField;

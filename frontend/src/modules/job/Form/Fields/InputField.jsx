import React from "react";
import PropTypes from "prop-types";
import { FormItem, Input } from "../../../../components";

const InputField = (props) => {
  const { name, label } = props;

  return (
    <FormItem
      name={name}
      label={label}
      rules={[
        {
          required: true,
          message: `Please enter ${label}`,
        },
      ]}
    >
      <Input placeholder={`${label}...`} />
    </FormItem>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default InputField;

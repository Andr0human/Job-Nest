import React from "react";
import PropTypes from "prop-types";
import { DatePicker, FormItem } from "../../../../components";

const DatePickerField = (props) => {
  const { name, label } = props;

  return (
    <FormItem
      name={name}
      label={label}
      rules={[
        {
          required: true,
          message: `Please select ${label}`,
        },
      ]}
    >
      <DatePicker />
    </FormItem>
  );
};

DatePickerField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default DatePickerField;

import PropTypes from "prop-types";
import React from "react";
import { Cascader, Col, FormItem } from "../../../../components";

const CascaderField = (props) => {
  const { name, label, options } = props;

  const selectOptions = Object.values(options).map(({ state, cities }) => ({
    label: state,
    value: state,
    desc: state,
    children: cities.map((city) => ({ label: city, value: city, desc: city })),
  }));

  return (
    <Col lg={12} md={8} xs={24}>
      <FormItem name={name} label={label}>
        <Cascader
          options={selectOptions}
          dropdownStyle={{ textAlign: "center" }}
          placeholder="Location..."
        />
      </FormItem>
    </Col>
  );
};

CascaderField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default CascaderField;

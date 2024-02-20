import React from "react";
import { Col, FormItem, RadioGroup } from "../../../../components";

const radioOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const RadioField = () => {
  return (
    <Col lg={12} md={8} xs={24}>
      <FormItem
        name="isRemote"
        label="Is Remote"
        rules={[
          {
            required: true,
            message: "Please select if the job is remote",
          },
        ]}
      >
        <RadioGroup options={radioOptions} />
      </FormItem>
    </Col>
  );
};

export default RadioField;

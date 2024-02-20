import PropTypes from "prop-types";
import React from "react";
import { Button, FormItem, FormList, Input } from "../../../../components";
import {
  MinusCircleOutlined,
  PlusOutlined,
} from "../../../../components/Icons";
import "../form.css";

const ArrayField = (props) => {
  const { name, label, text } = props;

  return (
    <FormItem name={name} label={label}>
      <FormList name={name}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field, index) => (
                <div key={field.key} className="form-item-container">
                  <FormItem
                    name={[index]}
                    rules={[{ required: true }]}
                    className="form-subitem"
                  >
                    <Input />
                  </FormItem>
                  <MinusCircleOutlined
                    onClick={() => remove(field.name)}
                    className="form-subitem-icon"
                  />
                </div>
              ))}

              <Button
                type="dashed"
                block
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                {text}
              </Button>
            </>
          );
        }}
      </FormList>
    </FormItem>
  );
};

ArrayField.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default ArrayField;

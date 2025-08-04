import PropTypes from 'prop-types';

import { Button, FormItem, FormList, Input } from '../../../../components';
import {
  MinusCircleOutlined,
  PlusOutlined,
} from '../../../../components/Icons';
import '../form.css';

const ArrayField = props => {
  const { name, label, text, placeholder } = props;

  return (
    <FormItem name={name} label={label} className='array-field-container'>
      <FormList name={name}>
        {(fields, { add, remove }) => (
          <>
            <div className='array-items'>
              {fields.map((field, index) => (
                <div key={field.key} className='form-item-container'>
                  <FormItem
                    name={[index]}
                    rules={[
                      {
                        required: true,
                        message: `Please enter ${label.toLowerCase()}`,
                      },
                    ]}
                    className='form-subitem'
                  >
                    <Input
                      placeholder={
                        placeholder ||
                        `Enter ${label.toLowerCase().slice(0, -1)}`
                      }
                      size='middle'
                    />
                  </FormItem>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      className='form-subitem-icon'
                      title='Remove item'
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              type='dashed'
              block
              onClick={() => add()}
              icon={<PlusOutlined />}
              className='add-item-btn'
              size='middle'
            >
              {text}
            </Button>
          </>
        )}
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
  placeholder: PropTypes.string,
};

export default ArrayField;

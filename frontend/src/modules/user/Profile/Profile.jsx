import { Form, message } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  DatePicker,
  FormItem,
  FormList,
  Input,
  Select,
  TextArea,
} from '../../../components';
import { MinusCircleOutlined, PlusOutlined } from '../../../components/Icons';
import { delay } from '../../../lib/utils';
import apiInstance from '../../../services/api';
import { AuthenticationContext } from '../Authentication/Context';

import './profile.css';
import { domains, skills } from './selectOptions';

const skillOptions = Object.values(skills).map(value => ({
  label: value,
  value,
  desc: value,
}));

const domainOptions = Object.values(domains).map(value => ({
  label: value,
  value,
  desc: value,
}));

const genderOptions = [
  { label: 'Male', value: 'male', desc: 'male' },
  { label: 'Female', value: 'female', desc: 'female' },
  { label: 'Other', value: 'other', desc: 'other' },
];

const Profile = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { authData } = useContext(AuthenticationContext);

  const displayMessage = (messageType, data) => {
    messageApi.open({
      type: messageType,
      content: data?.message,
      duration: 1,
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await apiInstance.get(`/users/${authData.userId}`);

      const profileData = response.data?.data;

      if (profileData.dateOfBirth) {
        profileData.dateOfBirth = dayjs(profileData.dateOfBirth);
      }

      form.setFieldsValue(profileData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [form, authData.userId]);

  const handleSave = async e => {
    e.preventDefault();
    const profileData = form.getFieldsValue();
    delete profileData.email;

    try {
      await apiInstance.put(`/users/${authData.userId}`, profileData);

      await fetchData();
      setEditMode(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCancel = async () => {
    form.resetFields();

    await fetchData();
    setEditMode(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await apiInstance.delete(`/users/${authData.userId}`);

      displayMessage('success', {
        message:
          'Account successfully deleted. Redirecting to Dashboard page..',
      });

      await delay(1000);
      navigate('/');
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {contextHolder}
      <section className='profile-section'>
        <div className='profile-container'>
          {/* Header Card */}
          <div className='profile-header-card'>
            <div className='profile-header-content'>
              <div className='profile-info'>
                <h1 className='profile-title'>Profile Settings</h1>
                <p className='profile-subtitle'>
                  Manage your personal information and preferences
                </p>
              </div>
              <div className='profile-actions'>
                {editMode ? (
                  <>
                    <Button onClick={handleSave} type='primary'>
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                  </>
                ) : (
                  <Button type='primary' onClick={() => setEditMode(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className='profile-content-card'>
            <Form
              aria-label='profile-form'
              form={form}
              layout='vertical'
              disabled={!editMode}
            >
              {/* Personal Information Section */}
              <div className='profile-form-section'>
                <h2 className='section-title'>Personal Information</h2>
                <div className='form-grid'>
                  <FormItem
                    name='name'
                    label='Your full name'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your name!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter your full name' />
                  </FormItem>

                  <FormItem
                    label='Email'
                    name='email'
                    rules={[{ required: true }]}
                  >
                    <Input disabled placeholder='Your email address' />
                  </FormItem>

                  <FormItem name='dateOfBirth' label='Date Of Birth'>
                    <DatePicker
                      placeholder='Select your birth date'
                      style={{ width: '100%' }}
                    />
                  </FormItem>

                  <FormItem name='gender' label='Gender'>
                    <Select
                      placeholder='Select gender'
                      options={genderOptions}
                      allowClear
                    />
                  </FormItem>

                  <FormItem
                    name='phoneNumber'
                    label='Phone Number'
                    className='form-grid-full'
                  >
                    <Input placeholder='Enter your phone number' />
                  </FormItem>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className='profile-form-section'>
                <h2 className='section-title'>Professional Information</h2>

                <FormItem
                  name='summary'
                  label='Professional Summary'
                  className='form-grid-full'
                >
                  <TextArea
                    rows={6}
                    placeholder='Tell us about your professional background, experience, and career goals...'
                  />
                </FormItem>

                <div className='form-grid'>
                  <FormItem
                    name='skills'
                    label='Skills'
                    rules={[{ type: 'array' }]}
                  >
                    <Select
                      mode='multiple'
                      placeholder='Select your skills'
                      options={skillOptions}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </FormItem>

                  <FormItem
                    name='domains'
                    label='Preferred Work Domains'
                    rules={[{ type: 'array' }]}
                  >
                    <Select
                      mode='multiple'
                      placeholder='Select domains of interest'
                      options={domainOptions}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </FormItem>
                </div>

                {/* Achievements Section */}
                <div className='achievements-section'>
                  <FormItem name='achievements' label='Achievements & Awards'>
                    <FormList name='achievements'>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <div key={field.key} className='achievement-item'>
                              <FormItem
                                name={[index]}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter an achievement',
                                  },
                                ]}
                                className='achievement-input'
                              >
                                <Input placeholder='Describe your achievement or award...' />
                              </FormItem>

                              <button
                                type='button'
                                onClick={() => remove(field.name)}
                                className='achievement-remove'
                                aria-label='Remove achievement'
                              >
                                <MinusCircleOutlined />
                              </button>
                            </div>
                          ))}
                          <button
                            type='button'
                            onClick={() => add()}
                            className='add-achievement-btn'
                          >
                            <PlusOutlined />
                            Add Achievement
                          </button>
                        </>
                      )}
                    </FormList>
                  </FormItem>
                </div>
              </div>
            </Form>

            {/* Delete Account Section */}
            <div className='delete-account-section'>
              <div className='delete-section-header'>
                <div className='delete-warning-icon'>!</div>
                <h3>Delete Account</h3>
              </div>
              <p className='delete-warning-text'>
                Are you sure you want to delete your account? This action is
                irreversible and will permanently delete all your data
                associated with this account.
              </p>
              <Button
                className='delete-account-btn'
                onClick={handleDeleteAccount}
              >
                Delete Account Permanently
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;

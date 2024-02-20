import { Form, message } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  DatePicker,
  Divider,
  FormItem,
  FormList,
  Input,
  Select,
  Text,
  TextArea,
  Title,
} from "../../../components";
import { MinusCircleOutlined, PlusOutlined } from "../../../components/Icons";
import apiInstance from "../../../services/api";
import { AuthenticationContext } from "../Authentication/Context";
import "./profile.css";
import { domains, skills } from "./selectOptions";

const skillOptions = Object.values(skills).map((value) => ({
  label: value,
  value,
  desc: value,
}));

const domainOptions = Object.values(domains).map((value) => ({
  label: value,
  value,
  desc: value,
}));

const genderOptions = [
  { label: "Male", value: "male", desc: "male" },
  { label: "Female", value: "female", desc: "female" },
  { label: "Other", value: "other", desc: "other" },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const generateUrl = () => `/users/${authData.userId}`;

  const fetchData = async () => {
    try {
      const response = await apiInstance.get(generateUrl());

      const profileData = response.data?.data;

      if (profileData.dateOfBirth) {
        profileData.dateOfBirth = dayjs(profileData.dateOfBirth);
      }

      form.setFieldsValue(profileData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const profileData = form.getFieldsValue();
    delete profileData.email;

    try {
      await apiInstance.put(generateUrl(), profileData);

      await fetchData();
      setEditMode(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCancel = async () => {
    form.resetFields();

    await fetchData();
    setEditMode(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await apiInstance.delete(generateUrl());

      displayMessage("success", {
        message:
          "Account successfully deleted. Redirecting to Dashboard page..",
      });

      await delay(1000);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      <section className="profile-section">
        <div className="profile-container">
          <div className="profile-title">
            <Title style={{ fontSize: 32 }}>Profile Page</Title>
          </div>
          <div className="profile-header">
            {editMode ? (
              <>
                <Button onClick={handleSave} type="primary">
                  Save
                </Button>
                <Button style={{ marginLeft: 10 }} onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </div>

          <Form
            aria-label="profile-form"
            form={form}
            layout="vertical"
            disabled={!editMode}
          >
            <FormItem
              name="name"
              label="Your full name ?"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input />
            </FormItem>

            <FormItem label="Email" name="email" rules={[{ required: true }]}>
              <Input disabled={true} />
            </FormItem>

            <FormItem name="dateOfBirth" label="Date Of Birth">
              <DatePicker />
            </FormItem>

            <FormItem name="gender" label="Gender">
              <Select
                placeholder="Select gender"
                options={genderOptions}
                allowClear
              />
            </FormItem>

            <FormItem name="phoneNumber" label="Phone Number">
              <Input />
            </FormItem>

            <FormItem name="summary" label="Summary">
              <TextArea rows={6} />
            </FormItem>

            <FormItem name="skills" label="Skills" rules={[{ type: "array" }]}>
              <Select
                mode="multiple"
                placeholder="Please select skills"
                options={skillOptions}
              />
            </FormItem>

            <FormItem
              name="domains"
              label="Which domain are you interested in working?"
              rules={[{ type: "array" }]}
            >
              <Select
                mode="multiple"
                placeholder="Type Domain"
                options={domainOptions}
              />
            </FormItem>

            <FormItem name="achievements" label="Add Achievements">
              <FormList name="achievements">
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: "flex" }}>
                          <FormItem
                            name={[index]}
                            rules={[{ required: true }]}
                            style={{ width: "95%" }}
                          >
                            <Input />
                          </FormItem>

                          <Button
                            type="danger"
                            onClick={() => remove(field.name)}
                            icon={<MinusCircleOutlined />}
                          />
                        </div>
                      ))}
                      <FormItem>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add achievement
                        </Button>
                      </FormItem>
                    </>
                  );
                }}
              </FormList>
            </FormItem>
          </Form>

          <Divider orientation="left" orientationMargin={20}>
            <Title level={5}>Delete Account</Title>
          </Divider>
          <Text style={{ display: "block" }}>
            Are you sure you want to delete your account? This action is
            irreversible and will permanently delete all your data associated
            with this account.
          </Text>
          <Button
            type="primary"
            danger
            style={{ marginTop: 15 }}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </section>
    </>
  );
};

export default Profile;

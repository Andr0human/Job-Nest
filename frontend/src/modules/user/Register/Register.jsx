import { message } from "antd";
import React, { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  FormItem,
  Input,
  InputPassword,
  Text,
  Title,
} from "../../../components";
import {
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined,
} from "../../../components/Icons";
import apiInstance from "../../../services/api";
import { AuthenticationContext } from "../Authentication/Context";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Register = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { isAuth } = useContext(AuthenticationContext);

  const displaySuccessMessage = (message) => {
    messageApi.open({
      type: "success",
      content: message,
      duration: 1,
    });
  };

  const displayErrorMessage = (data) => {
    if (data?.error?.details) {
      data.error.details.forEach((error) =>
        messageApi.open({
          type: "error",
          content: error.message,
          duration: 10,
        })
      );
      return;
    }

    messageApi.open({
      type: "error",
      content: data.message,
      duration: 4,
    });
  };

  const onFinish = async (values) => {
    const { confirmPassword, ...formData } = values;

    try {
      await apiInstance.post("/users/register", formData);
      displaySuccessMessage(
        "User successfully registered. Redirecting to login page.."
      );

      await delay(1000);
      navigate("/login");
    } catch (error) {
      console.log(error);
      displayErrorMessage(error.response.data);
    }
  };

  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {contextHolder}
      <section className="form-section">
        <div className="form-container">
          <div className="form-header">
            <UserAddOutlined className="form-icon" />
            <Title className="form-title">Sign Up</Title>
            <Text className="form-text">
              Welcome to JobNest! Please enter your details to get started.
            </Text>
          </div>
          <Form
            aria-label="register-form"
            name="register"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <FormItem
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input your Name!",
                },
              ]}
              hasFeedback
            >
              <Input prefix={<UserOutlined />} placeholder="Name" />
            </FormItem>

            <FormItem
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
              hasFeedback
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </FormItem>
            <FormItem
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <InputPassword
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </FormItem>

            <FormItem
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <InputPassword
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </FormItem>

            <FormItem>
              <Button block="true" type="primary" htmlType="submit">
                Sign Up
              </Button>
              <div className="form-footer">
                <Text className="form-text">Already have an account?</Text>
                <Link to="/login">Sign in</Link>
              </div>
            </FormItem>
          </Form>
        </div>
      </section>
    </>
  );
};

export default Register;

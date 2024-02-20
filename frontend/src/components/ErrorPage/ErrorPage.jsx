import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const ErrorPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you are looking for does not exist."
    extra={
      <Link to="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
);

export default ErrorPage;
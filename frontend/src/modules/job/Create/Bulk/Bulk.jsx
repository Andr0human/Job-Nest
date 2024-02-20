import { message } from "antd";
import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Dragger,
  Row,
  Spin,
  Statistic,
  Title,
  Divider,
  CountUp,
} from "../../../../components";
import {
  ArrowUpOutlined,
  InboxOutlined,
  ReloadOutlined,
} from "../../../../components/Icons";
import apiInstance from "../../../../services/api";
import UploadHistory from "./History";
import "./bulk.css";

const formatter = (value) => <CountUp end={value} separator="," />;

const BulkUpload = () => {
  const [loading, setLoading] = useState(true);
  const [jobListingCount, setJobListingCount] = useState(0);
  const [toFetchHistory, setToFetchHistory] = useState(true);

  const props = {
    name: "file",
    action: "http://localhost:8080/jobs/upload",
    accept: ".csv",
    beforeUpload: (file) => {
      if (file.type !== "text/csv") {
        message.error(
          `Invalid file type for ${file.name}. Please upload only CSV files.`
        );
        return false;
      }
      return true;
    },
    async onChange(info) {
      const { status, name } = info.file;

      fetchUploadCount();
      setToFetchHistory(true);

      if (status === "done") {
        message.success(`${name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      format: (percent) => percent && `${parseFloat(percent.toFixed(1))}%`,
      style: { width: "97%" },
    },
    listType: "picture",
  };

  const fetchUploadCount = async () => {
    try {
      const response = await apiInstance.get("/jobs/count");

      setJobListingCount(response?.data?.data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    setLoading(true);
    setToFetchHistory(true);
  };

  useEffect(() => {
    if (loading) {
      fetchUploadCount();
    }
  }, [loading]);

  return (
    <div>
      <Row gutter={12} className="count-container">
        <Col span={5}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Active Job Listings"
              value={jobListingCount}
              formatter={formatter}
              valueStyle={{ color: "green" }}
              prefix={<ArrowUpOutlined />}
              suffix={
                loading ? (
                  <Spin className="spin-icon" />
                ) : (
                  <ReloadOutlined
                    onClick={handleReload}
                    className="reload-btn"
                  />
                )
              }
            />
          </Card>
        </Col>
      </Row>

      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading banned files.
        </p>
      </Dragger>

      <Divider orientation="left" orientationMargin={20}>
        <Title level={4}>Upload History</Title>
      </Divider>

      <UploadHistory
        toFetchHistory={toFetchHistory}
        setToFetchHistory={setToFetchHistory}
      />
    </div>
  );
};

export default BulkUpload;

import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Card,
  DescriptionItem,
  Descriptions,
  Divider,
  Modal,
  Table,
  Title,
} from "../../../../components";
import apiInstance from "../../../../services/api";
import "./bulk.css";

const ErrorDetail = (props) => {
  const { recordId, formatMilliseconds } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [errorData, setErrorData] = useState({});

  const column = [
    { title: "Row Number", dataIndex: "rowNumber", key: "rowNumber" },
    { title: "Message", dataIndex: "message", key: "message" },
  ];

  const handleOk = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchErrorDetail = async () => {
      try {
        const response = await apiInstance.get(`bulk-upload/${recordId}`);

        const data = response.data.data;
        data.time = formatMilliseconds(data.time);
        data.createdAt = dayjs(data.createdAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        );
        data.updatedAt = dayjs(data.updatedAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        );

        if (data.endedAt) {
          data.endedAt = dayjs(data.endedAt).format("MMMM Do YYYY, h:mm:ss a");
        }

        setErrorData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!recordId) return;

    setIsOpen(true);

    fetchErrorDetail();
  }, [recordId]);

  return (
    <div>
      <Modal
        title={`Record ID - ${errorData._id}`}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleOk}
        width={"60%"}
      >
        <Card>
          <Descriptions bordered column={1}>
            <DescriptionItem label="Filename" className="bulk-text">
              {errorData.filename}
            </DescriptionItem>
            <DescriptionItem label="Status" className="bulk-text">
              {errorData.status}
            </DescriptionItem>
            <DescriptionItem label="Time" className="bulk-text">
              {errorData.time}
            </DescriptionItem>
            <DescriptionItem label="Status" className="bulk-text">
              {errorData.status}
            </DescriptionItem>
            <DescriptionItem label="Successful Entries" className="bulk-text">
              {errorData.successfulEntries}
            </DescriptionItem>
            <DescriptionItem label="Failed Entries" className="bulk-text">
              {errorData.failedEntries}
            </DescriptionItem>
            <DescriptionItem label="Entries Completed" className="bulk-text">
              {errorData.entriesCompleted}
            </DescriptionItem>
            <DescriptionItem label="Total Entries" className="bulk-text">
              {errorData.totalEntries}
            </DescriptionItem>
            <DescriptionItem label="createdAt" className="bulk-text">
              {errorData.createdAt}
            </DescriptionItem>
            <DescriptionItem label="updatedAt" className="bulk-text">
              {errorData.updatedAt}
            </DescriptionItem>
            {errorData.endedAt && (
              <DescriptionItem label="endedAt" className="bulk-text">
                {errorData.endedAt}
              </DescriptionItem>
            )}
          </Descriptions>
        </Card>
        {errorData.errorDetails?.length > 0 && (
          <>
            <Divider orientation="left" orientationMargin={20}>
              <Title level={4}>Error details</Title>
            </Divider>
            <Table
              dataSource={errorData.errorDetails}
              columns={column}
              pagination={{ pageSize: 10 }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

ErrorDetail.propTypes = {
  recordId: PropTypes.string.isRequired,
  formatMilliseconds: PropTypes.func.isRequired,
};

export default ErrorDetail;

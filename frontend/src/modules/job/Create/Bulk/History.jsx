import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  List,
  ListItem,
  ListItemMeta,
  Row,
  Statistic,
} from "../../../../components";
import apiInstance from "../../../../services/api";
import ErrorDetail from "./ErrorDetail";

const fontStyle = {
  completed: {
    fontSize: 19,
    color: "#3f8600",
  },
  running: {
    fontSize: 19,
    color: "#ada424",
  },
  failed: {
    fontSize: 19,
    color: "#cf1322",
  },
};

const fields = [
  "_id",
  "filename",
  "status",
  "entriesCompleted",
  "totalEntries",
  "time",
];

const UploadHistory = (props) => {
  const { toFetchHistory, setToFetchHistory } = props;
  const [uploadHistory, setUploadHistory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [recordId, setRecordId] = useState("");

  const formatMilliseconds = (value) => {
    if (value < 1000) return `${Math.floor(value)} ms`;

    const totalSeconds = Math.floor(value / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setToFetchHistory(true);
  };

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        const response = await apiInstance.get("bulk-upload", {
          params: {
            page: currentPage,
            limit: 10,
            fields: fields.join(","),
          },
        });

        setUploadHistory(response.data.data.data);
        setTotalCount(response.data.data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setToFetchHistory(false);
      }
    };

    if (toFetchHistory) {
      fetchUploadHistory();
    }
  }, [toFetchHistory]);

  return (
    <>
      <List
        itemLayout="vertical"
        size="small"
        pagination={{
          size: "small",
          position: "top",
          align: "center",
          pageSize: 10,
          current: currentPage,
          total: totalCount,
          onChange: handlePageChange,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        dataSource={uploadHistory}
        renderItem={(item, index) => (
          <ListItem
            key={item._id}
            extra={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Button data-testid={`view-button-${index}`} type="primary" onClick={() => setRecordId(item._id)}>
                  View
                </Button>
              </div>
            }
          >
            <ListItemMeta
              title={`Record ID - ${item._id}`}
              description={
                <Row gutter={24}>
                  <Col span={5}>
                    <Statistic
                      title="Filename"
                      value={item.filename}
                      valueStyle={fontStyle[item.status]}
                    />
                  </Col>
                  <Col span={4}>
                    <Statistic
                      title="status"
                      value={item.status}
                      valueStyle={fontStyle[item.status]}
                    />
                  </Col>
                  <Col span={5}>
                    <Statistic
                      title="Entries Completed"
                      value={item.entriesCompleted}
                      valueStyle={fontStyle[item.status]}
                    />
                  </Col>
                  <Col span={5}>
                    <Statistic
                      title="Total Entries"
                      value={item.totalEntries}
                      valueStyle={fontStyle[item.status]}
                    />
                  </Col>
                  <Col span={4}>
                    <Statistic
                      title="time"
                      value={item.time}
                      valueStyle={fontStyle[item.status]}
                      formatter={formatMilliseconds}
                    />
                  </Col>
                </Row>
              }
            />
          </ListItem>
        )}
      />
      <ErrorDetail
        recordId={recordId}
        formatMilliseconds={formatMilliseconds}
      />
    </>
  );
};

UploadHistory.propTypes = {
  toFetchHistory: PropTypes.bool.isRequired,
  setToFetchHistory: PropTypes.func.isRequired,
};

export default UploadHistory;

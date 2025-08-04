/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import {
  Card,
  DescriptionItem,
  Descriptions,
  Divider,
  Modal,
  Table,
  Title,
  Tag,
} from '../../../../components';
import apiInstance from '../../../../services/api';
import './bulk.css';

const ErrorDetail = props => {
  const { recordId, formatMilliseconds } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [errorData, setErrorData] = useState({});

  const columns = [
    {
      title: 'Row Number',
      dataIndex: 'rowNumber',
      key: 'rowNumber',
      width: '20%',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      width: '80%',
    },
  ];

  const getStatusTag = status => {
    const statusColors = {
      completed: 'success',
      running: 'warning',
      failed: 'error',
    };

    return <Tag color={statusColors[status] || 'default'}>{status}</Tag>;
  };

  const handleOk = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchErrorDetail = async () => {
      try {
        const response = await apiInstance.get(`bulk-upload/${recordId}`);

        const { data } = response.data;
        data.time = formatMilliseconds(data.time);
        data.createdAt = dayjs(data.createdAt).format(
          'MMMM Do YYYY, h:mm:ss a',
        );
        data.updatedAt = dayjs(data.updatedAt).format(
          'MMMM Do YYYY, h:mm:ss a',
        );

        if (data.endedAt) {
          data.endedAt = dayjs(data.endedAt).format('MMMM Do YYYY, h:mm:ss a');
        }

        setErrorData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!recordId) return;

    setIsOpen(true);

    fetchErrorDetail();
  }, [recordId, formatMilliseconds]);

  return (
    <div>
      <Modal
        title={`Record Details: ${errorData.filename || ''}`}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleOk}
        width='70%'
        className='error-detail-modal'
      >
        <Card className='detail-card'>
          <Descriptions
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            <DescriptionItem label='Record ID' className='bulk-text'>
              {errorData._id}
            </DescriptionItem>
            <DescriptionItem label='Filename' className='bulk-text'>
              {errorData.filename}
            </DescriptionItem>
            <DescriptionItem label='Status' className='bulk-text'>
              {getStatusTag(errorData.status)}
            </DescriptionItem>
            <DescriptionItem label='Time' className='bulk-text'>
              {errorData.time}
            </DescriptionItem>
            <DescriptionItem label='Successful Entries' className='bulk-text'>
              {errorData.successfulEntries}
            </DescriptionItem>
            <DescriptionItem label='Failed Entries' className='bulk-text'>
              {errorData.failedEntries}
            </DescriptionItem>
            <DescriptionItem label='Entries Completed' className='bulk-text'>
              {errorData.entriesCompleted}
            </DescriptionItem>
            <DescriptionItem label='Total Entries' className='bulk-text'>
              {errorData.totalEntries}
            </DescriptionItem>
            <DescriptionItem label='Created At' className='bulk-text'>
              {errorData.createdAt}
            </DescriptionItem>
            <DescriptionItem label='Updated At' className='bulk-text'>
              {errorData.updatedAt}
            </DescriptionItem>
            {errorData.endedAt && (
              <DescriptionItem label='Ended At' className='bulk-text'>
                {errorData.endedAt}
              </DescriptionItem>
            )}
          </Descriptions>
        </Card>
        {errorData.errorDetails?.length > 0 && (
          <>
            <Divider orientation='left' orientationMargin={20}>
              <Title level={4}>Error Details</Title>
            </Divider>
            <Table
              dataSource={errorData.errorDetails}
              columns={columns}
              pagination={{ pageSize: 10 }}
              className='error-table'
              rowKey='rowNumber'
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

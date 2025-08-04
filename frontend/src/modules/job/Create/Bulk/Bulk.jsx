import { message } from 'antd';
import { useEffect, useState } from 'react';

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
} from '../../../../components';
import {
  ArrowUpOutlined,
  InboxOutlined,
  ReloadOutlined,
} from '../../../../components/Icons';
import apiInstance from '../../../../services/api';

import UploadHistory from './History';
import './bulk.css';

const formatter = value => <CountUp end={value} separator=',' />;

const BulkUpload = () => {
  const [loading, setLoading] = useState(true);
  const [jobListingCount, setJobListingCount] = useState(0);
  const [toFetchHistory, setToFetchHistory] = useState(true);

  const fetchUploadCount = async () => {
    try {
      const response = await apiInstance.get('/jobs/count');
      setJobListingCount(response?.data?.data?.count);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const props = {
    name: 'file',
    action: `${process.env.REACT_APP_BASE_URL}/jobs/upload`,
    accept: '.csv',
    beforeUpload: file => {
      if (file.type !== 'text/csv') {
        message.error(
          `Invalid file type for ${file.name}. Please upload only CSV files.`,
        );
        return false;
      }
      return true;
    },
    async onChange(info) {
      const { status, name } = info.file;

      fetchUploadCount();
      setToFetchHistory(true);

      if (status === 'done') {
        message.success(`${name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      format: percent => percent && `${parseFloat(percent.toFixed(1))}%`,
      style: { width: '97%' },
    },
    listType: 'picture',
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
      <Row gutter={12} className='count-container'>
        <Col span={5}>
          <Card bordered={false} hoverable>
            <Statistic
              title='Active Job Listings'
              value={jobListingCount}
              formatter={formatter}
              valueStyle={{ color: 'green' }}
              prefix={<ArrowUpOutlined />}
              suffix={
                loading ? (
                  <Spin className='spin-icon' />
                ) : (
                  <ReloadOutlined
                    onClick={handleReload}
                    className='reload-btn'
                  />
                )
              }
            />
          </Card>
        </Col>
      </Row>

      <Dragger {...props}>
        <div className='upload-icon'>
          <InboxOutlined />
        </div>
        <div>Click or drag file to this area to upload</div>
        <div>
          Support for a single or bulk upload. Strictly prohibited from
          uploading banned files.
        </div>
      </Dragger>

      <Divider orientation='left' orientationMargin={20}>
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

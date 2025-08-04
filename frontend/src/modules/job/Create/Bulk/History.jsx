/* eslint-disable no-underscore-dangle */
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import {
  Button,
  Col,
  List,
  ListItem,
  ListItemMeta,
  Row,
} from '../../../../components';
import { EyeOutlined } from '../../../../components/Icons';
import apiInstance from '../../../../services/api';

import ErrorDetail from './ErrorDetail';
import './bulk.css';

const fontStyle = {
  completed: {
    fontSize: '1rem',
    color: 'var(--success-600)',
  },
  running: {
    fontSize: '1rem',
    color: 'var(--warning-600)',
  },
  failed: {
    fontSize: '1rem',
    color: 'var(--error-600)',
  },
};

const statusConfig = {
  completed: {
    icon: <CheckCircleOutlined />,
    color: 'var(--success-600)',
    background: 'var(--success-50)',
    borderColor: 'var(--success-200)',
  },
  running: {
    icon: <ClockCircleOutlined />,
    color: 'var(--warning-600)',
    background: 'var(--warning-50)',
    borderColor: 'var(--warning-200)',
  },
  failed: {
    icon: <CloseCircleOutlined />,
    color: 'var(--error-600)',
    background: 'var(--error-50)',
    borderColor: 'var(--error-200)',
  },
};

const fields = [
  '_id',
  'filename',
  'status',
  'entriesCompleted',
  'totalEntries',
  'time',
];

const UploadHistory = props => {
  const { toFetchHistory, setToFetchHistory } = props;
  const [uploadHistory, setUploadHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [recordId, setRecordId] = useState('');

  const formatMilliseconds = value => {
    if (value < 1000) return `${Math.floor(value)} ms`;

    const totalSeconds = Math.floor(value / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    setToFetchHistory(true);
  };

  const getStatusDisplay = status => {
    const config = statusConfig[status] || statusConfig.failed;
    return (
      <div
        className='status-badge'
        style={{
          color: config.color,
          background: config.background,
          borderColor: config.borderColor,
          border: `1px solid ${config.borderColor}`,
          borderRadius: 'var(--radius-md)',
          padding: '0.25rem 0.75rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500,
          fontSize: '0.875rem',
        }}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getProgressColor = status => {
    if (status === 'completed') return 'var(--success-600)';
    if (status === 'failed') return 'var(--error-600)';
    return 'var(--warning-600)';
  };

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        const response = await apiInstance.get('bulk-upload', {
          params: {
            page: currentPage,
            limit: 10,
            fields: fields.join(','),
          },
        });

        setUploadHistory(response?.data?.data?.data || []);
        setTotalCount(response?.data?.data?.total || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setUploadHistory([]);
        setTotalCount(0);
      } finally {
        setToFetchHistory(false);
      }
    };

    if (toFetchHistory) {
      fetchUploadHistory();
    }
  }, [toFetchHistory, currentPage, setToFetchHistory]);

  return (
    <div className='history-container'>
      <List
        itemLayout='vertical'
        size='large'
        pagination={{
          size: 'small',
          position: 'top',
          align: 'center',
          pageSize: 10,
          current: currentPage,
          total: totalCount,
          onChange: handlePageChange,
          pageSizeOptions: [10, 20, 50],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} uploads`,
        }}
        dataSource={uploadHistory}
        renderItem={(item, index) => (
          <ListItem
            key={item._id}
            className={`upload-history-item ${item.status}`}
            style={{
              marginTop: '1rem',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--gray-200)',
              marginBottom: 'var(--spacing-4)',
              padding: 'var(--spacing-6)',
              transition: 'all var(--transition-fast)',
            }}
            extra={
              <Button
                data-testid={`view-button-${index}`}
                type='primary'
                onClick={() => setRecordId(item._id)}
                className='view-details-button'
                icon={<EyeOutlined />}
                style={{
                  background:
                    'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                  borderColor: 'var(--primary-600)',
                  borderRadius: 'var(--radius-md)',
                  height: 'auto',
                  padding: '0.5rem 1rem',
                  fontWeight: 500,
                }}
              >
                View Details
              </Button>
            }
          >
            <ListItemMeta
              title={
                <div
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 600,
                    color: 'var(--gray-800)',
                    marginBottom: 'var(--spacing-2)',
                  }}
                >
                  Upload Record - {item._id}
                </div>
              }
              description={
                <Row gutter={[16, 16]} className='history-item-stats'>
                  <Col xs={24} sm={12} md={6} lg={4}>
                    <div className='stat-item'>
                      <div className='stat-label'>Filename</div>
                      <div
                        className='stat-value'
                        style={fontStyle[item.status]}
                      >
                        {item.filename}
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={4}>
                    <div className='stat-item'>
                      <div className='stat-label'>Status</div>
                      <div className='stat-value'>
                        {getStatusDisplay(item.status)}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={4} lg={3}>
                    <div className='stat-item'>
                      <div className='stat-label'>Completed</div>
                      <div
                        className='stat-value'
                        style={fontStyle[item.status]}
                      >
                        {item.entriesCompleted}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={4} lg={3}>
                    <div className='stat-item'>
                      <div className='stat-label'>Total</div>
                      <div
                        className='stat-value'
                        style={fontStyle[item.status]}
                      >
                        {item.totalEntries}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={4} lg={3}>
                    <div className='stat-item'>
                      <div className='stat-label'>Duration</div>
                      <div
                        className='stat-value'
                        style={fontStyle[item.status]}
                      >
                        {formatMilliseconds(item.time)}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={24} md={6} lg={7}>
                    <div className='stat-item'>
                      <div className='stat-label'>Progress</div>
                      <div
                        className='progress-bar'
                        style={{
                          background: 'var(--gray-200)',
                          borderRadius: 'var(--radius-sm)',
                          height: '8px',
                          overflow: 'hidden',
                          marginTop: '0.25rem',
                        }}
                      >
                        <div
                          style={{
                            background: getProgressColor(item.status),
                            height: '100%',
                            width: `${Math.round(
                              (item.entriesCompleted / item.totalEntries) * 100,
                            )}%`,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--gray-500)',
                          marginTop: '0.25rem',
                        }}
                      >
                        {Math.round(
                          (item.entriesCompleted / item.totalEntries) * 100,
                        )}
                        % complete
                      </div>
                    </div>
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
    </div>
  );
};

UploadHistory.propTypes = {
  toFetchHistory: PropTypes.bool.isRequired,
  setToFetchHistory: PropTypes.func.isRequired,
};

export default UploadHistory;

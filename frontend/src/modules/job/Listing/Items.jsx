/* eslint-disable no-underscore-dangle */
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, List, ListItem, Popconfirm } from '../../../components';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from '../../../components/Icons';
import apiInstance from '../../../services/api';
import { AuthenticationContext } from '../../user';

import { ListingContext } from './Context';

const fields = [
  '_id',
  'title',
  'company',
  'logo',
  'salary',
  'address',
  'description',
];

const ItemsData = () => {
  const { isAuth } = useContext(AuthenticationContext);

  const {
    toFetch,
    setToFetch,
    filters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalCount,
    setTotalCount,
  } = useContext(ListingContext);

  const [jobListing, setJobListing] = useState([]);

  const fetchData = useCallback(async () => {
    const queryFilters = () => {
      const query = Object.entries(filters).reduce((acc, [key, value]) => {
        const newValue = Array.isArray(value) ? value.join(',') : value;
        return newValue ? { ...acc, [key]: newValue } : acc;
      }, {});

      if (query.salary === '200000,5000000') {
        delete query.salary;
      }

      return query;
    };

    try {
      const response = await apiInstance.get('/jobs/?', {
        params: {
          ...queryFilters(),
          page: currentPage,
          limit: itemsPerPage,
          fields: fields.join(','),
        },
      });

      setJobListing(response?.data?.data?.data);
      setTotalCount(response?.data?.data?.total);
    } catch (error) {
      console.error(error);
    } finally {
      setToFetch(false);
    }
  }, [currentPage, itemsPerPage, setToFetch, filters, setTotalCount]);

  useEffect(() => {
    if (toFetch) {
      fetchData();
    }
  }, [toFetch, fetchData]);

  const deleteJobListing = async jobId => {
    try {
      await apiInstance.delete(`/jobs/${jobId}`);
      setToFetch(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setItemsPerPage(size);
    setToFetch(true);
  };

  const formatSalary = salary => {
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L`;
    }
    return `₹${(salary / 1000).toFixed(0)}K`;
  };

  return (
    <div className='item-container'>
      <List
        itemLayout='vertical'
        size='large'
        className='items-list'
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          size: 'default',
          align: 'center',
          pageSize: itemsPerPage,
          total: totalCount,
          current: currentPage,
          onChange: handlePageChange,
          pageSizeOptions: [5, 10, 20, 50],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} jobs`,
        }}
        dataSource={jobListing}
        renderItem={(item, index) => (
          <ListItem key={item._id}>
            <div className='job-card-header'>
              <div className='job-card-meta'>
                <img
                  alt={`${item.company} logo`}
                  src={item.logo}
                  className='items-avatar'
                  onError={e => {
                    e.target.src =
                      'https://via.placeholder.com/80x80?text=Logo';
                  }}
                />

                <div className='job-card-info'>
                  <h3 className='job-title'>{item.title}</h3>
                  <div className='job-company'>{item.company}</div>

                  <div className='job-details'>
                    <div className='job-detail-item'>
                      <DollarOutlined className='job-detail-icon' />
                      <span className='job-salary'>
                        {formatSalary(item.salary)} / year
                      </span>
                    </div>

                    {item.address && (
                      <div className='job-detail-item'>
                        <EnvironmentOutlined className='job-detail-icon' />
                        <span className='job-location'>
                          {item.address.city}, {item.address.state}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='job-tags'>
                    <span className='job-tag'>Full-time</span>
                    {item.salary > 1000000 && (
                      <span className='job-tag featured'>High Salary</span>
                    )}
                  </div>
                </div>
              </div>

              <div className='job-actions'>
                <Link to={`/jobs/${item._id}`}>
                  <Button
                    data-testid={`view-button-${index}`}
                    className='item-btn view-btn'
                    title='View Details'
                  >
                    <EyeOutlined />
                  </Button>
                </Link>

                {isAuth && (
                  <>
                    <Link to={`/edit/${item._id}`}>
                      <Button
                        data-testid={`edit-button-${index}`}
                        className='item-btn edit-btn'
                        title='Edit Job'
                      >
                        <EditOutlined />
                      </Button>
                    </Link>

                    <Popconfirm
                      title='Delete this job listing?'
                      description='This action cannot be undone.'
                      placement='left'
                      onConfirm={() => deleteJobListing(item._id)}
                      okText='Delete'
                      cancelText='Cancel'
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        data-testid={`delete-button-${index}`}
                        className='item-btn delete-btn'
                        title='Delete Job'
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </div>
            </div>

            {item.description && (
              <div className='job-description'>{item.description}</div>
            )}
          </ListItem>
        )}
      />
    </div>
  );
};

export default ItemsData;

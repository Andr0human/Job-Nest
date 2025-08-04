/* eslint-disable no-underscore-dangle */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Title } from '../../../../components';
import apiInstance from '../../../../services/api';
import { AuthenticationContext } from '../../../user';
import { UploadForm } from '../../Form';
import './single.css';

const SingleUpload = () => {
  const { isAuth, authData, setAuthData } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const uploadSuccess = () => {
    navigate('/jobs');
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const response = await apiInstance.get('/users/token');

        setAuthData({
          userId: response.data.data._id,
          email: response.data.data.email,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuth) {
      getUser();
    }
  }, [isAuth, setAuthData]);

  if (loading) {
    return (
      <div className='create-job-loading'>
        <div className='loading-spinner' />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className='create-job-container'>
      <div className='form-wrapper'>
        <UploadForm
          formHeading='Job Details'
          submitMessage='Create Job Listing'
          requestMethod='POST'
          requestApi={`${process.env.REACT_APP_BASE_URL}/jobs`}
          uploadSuccess={uploadSuccess}
          createdBy={authData?.userId}
        />
      </div>

      <div className='help-sidebar'>
        <Card className='help-card'>
          <Title level={4}>💡 Pro Tips</Title>
          <div className='tips-list'>
            <div className='tip-item'>
              <span className='tip-icon'>✓</span>
              <p>
                Use clear, descriptive job titles to attract relevant candidates
              </p>
            </div>
            <div className='tip-item'>
              <span className='tip-icon'>✓</span>
              <p>Include salary range to save time for both parties</p>
            </div>
            <div className='tip-item'>
              <span className='tip-icon'>✓</span>
              <p>Be specific about required skills and experience level</p>
            </div>
            <div className='tip-item'>
              <span className='tip-icon'>✓</span>
              <p>Mention company culture and benefits to stand out</p>
            </div>
          </div>
        </Card>

        <Card className='preview-card'>
          <Title level={4}>📋 Quick Preview</Title>
          <p>Your job listing will appear in:</p>
          <ul>
            <li>Job search results</li>
            <li>Category filters</li>
            <li>Location-based searches</li>
            <li>Salary range filters</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SingleUpload;

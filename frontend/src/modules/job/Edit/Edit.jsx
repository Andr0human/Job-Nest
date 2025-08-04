import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorPage } from '../../../components';
import apiInstance from '../../../services/api';
import { AuthenticationContext } from '../../user';
import { UploadForm } from '../Form';
import './edit.css';

const Edit = () => {
  const { jobId } = useParams();
  const [jobListing, setJobListing] = useState({});
  const [notFound, setNotFound] = useState(false);
  const { authData } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  const uploadSuccess = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiInstance.get(`/jobs/${jobId}`);
        const responseData = response?.data?.data;
        responseData.applicationDeadline = dayjs(
          responseData?.applicationDeadline,
        );

        if (responseData?.address) {
          responseData.address = [
            responseData?.address?.state,
            responseData?.address?.city,
          ];
        }

        setJobListing(responseData);
      } catch (error) {
        setNotFound(true);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [jobId]);

  if (notFound) {
    return <ErrorPage />;
  }

  return (
    <div className='edit-upload-form'>
      <UploadForm
        formHeading='Edit JobListing'
        jobListing={jobListing}
        submitMessage='Update Job'
        requestMethod='PUT'
        requestApi={`${process.env.REACT_APP_BASE_URL}/jobs/${jobId}`}
        uploadSuccess={uploadSuccess}
        updatedBy={authData.userId}
      />
    </div>
  );
};

export default Edit;

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { Content, Layout, Menu, Sider } from '../../../components';
import { FileAddOutlined, UploadOutlined } from '../../../components/Icons';

import { BulkUpload } from './Bulk';
import { SingleUpload } from './Single';
import './create.css';

const Create = ({ uploadType = 'single' }) => {
  const navigate = useNavigate();
  // Menu items for the sidebarcreate-page-layout
  const sidebarItems = [
    {
      key: 'single',
      label: 'Post Job',
      icon: <UploadOutlined />,
    },
    {
      key: 'bulk',
      label: 'Bulk Upload',
      icon: <FileAddOutlined />,
    },
  ];

  // Component map based on the upload type
  const componentMap = {
    single: <SingleUpload />,
    bulk: <BulkUpload />,
  };

  // Handle menu selection
  const handleMenuKey = e => {
    navigate(`/jobs/create/${e.key}`);
  };

  return (
    <Layout className='create-page-layout'>
      <Content className='create-page-content'>
        <div className='create-header'>
          <h1 className='create-title'>Create a Job</h1>
          <p className='create-subtitle'>
            Fill in the details to create a new job or upload multiple jobs
          </p>
        </div>

        <Layout className='create-inner-layout'>
          <Sider className='create-sider' width={220}>
            <Menu
              items={sidebarItems}
              selectedKeys={[uploadType]}
              onClick={handleMenuKey}
              className='create-sider-menu'
            />
          </Sider>

          <Content className='create-content'>
            {componentMap[uploadType]}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

Create.propTypes = {
  uploadType: PropTypes.string,
};

export default Create;

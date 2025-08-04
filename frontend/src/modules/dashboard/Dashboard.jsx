import { Link } from 'react-router-dom';

import { Button, Card, Col, Layout, Row, Statistic } from '../../components';
import {
  BriefcaseIcon,
  UserOutlined,
  EnvironmentOutlined,
} from '../../components/Icons';
import './Dashboard.css';

const Dashboard = () => (
  <Layout className='dashboard-page-layout'>
    <div className='dashboard-page-content'>
      <div className='dashboard-welcome'>
        <h1 className='welcome-title'>Welcome to JobNest</h1>
        <p className='welcome-subtitle'>Your ultimate job search platform</p>
      </div>

      <Row gutter={[24, 24]} className='dashboard-stats'>
        <Col xs={24} sm={8}>
          <Card className='stats-card'>
            <Statistic
              title='Active Jobs'
              value={1247}
              prefix={<BriefcaseIcon />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div className='card-action'>
              <Link to='/jobs'>
                <Button type='primary'>Browse Jobs</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className='stats-card'>
            <Statistic
              title='Companies'
              value={250}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix='+'
            />
            <div className='card-action'>
              <Button>View Companies</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className='stats-card'>
            <Statistic
              title='Locations'
              value={50}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix='+'
            />
            <div className='card-action'>
              <Button>Explore Locations</Button>
            </div>
          </Card>
        </Col>
      </Row>

      <div className='dashboard-actions'>
        <h2 className='actions-title'>Quick Actions</h2>
        <Row gutter={[24, 24]} className='action-cards'>
          <Col xs={24} md={12}>
            <Card className='action-card'>
              <h3 className='action-title'>Search Jobs</h3>
              <p className='action-description'>
                Browse through thousands of job listings from top companies
              </p>
              <Link to='/jobs'>
                <Button type='primary' block>
                  Find Jobs
                </Button>
              </Link>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className='action-card'>
              <h3 className='action-title'>Post a Job</h3>
              <p className='action-description'>
                Create a new job listing or upload multiple jobs at once
              </p>
              <Link to='/jobs/create'>
                <Button type='primary' block>
                  Post Job
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  </Layout>
);

export default Dashboard;

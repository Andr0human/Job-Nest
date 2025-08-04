import { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Content,
  Dropdown,
  Footer,
  Header,
  Layout,
  Menu,
} from '../../components';
import {
  BriefcaseIcon,
  SearchIcon,
  UploadIcon,
  UserOutlined,
} from '../../components/Icons';
import { AuthenticationContext } from '../user';
import './Navbar.css';

const navbarItems = [
  {
    key: 'jobs',
    label: (
      <div className='nav-item'>
        <SearchIcon className='nav-icon' />
        <span className='nav-text'>Browse Jobs</span>
      </div>
    ),
  },
  {
    key: 'create',
    label: (
      <div className='nav-item'>
        <UploadIcon className='nav-icon' />
        <span className='nav-text'>Post a Job</span>
      </div>
    ),
  },
];

const Navbar = () => {
  const { isAuth } = useContext(AuthenticationContext);
  const [activePage, setActivePage] = useState('jobs');
  const navigate = useNavigate();
  const location = useLocation();

  // Update activePage based on current URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/jobs/create')) {
      setActivePage('create');
    } else if (path.includes('/jobs')) {
      setActivePage('jobs');
    } else {
      // Set default to 'jobs' if no match
      setActivePage('jobs');
    }
  }, [location.pathname]);

  const handleMenuKey = e => {
    if (e.key === 'jobs') {
      navigate('/jobs');
      setActivePage('jobs');
    } else if (e.key === 'create') {
      navigate('/jobs/create');
      setActivePage('create');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Navigate to home page instead of reloading to avoid JSDOM issues in tests
    navigate('/');
  };

  const items = [
    {
      label: (
        <Link to='/profile' className='dropdown-link'>
          My Profile
        </Link>
      ),
      key: 'profile',
    },
    {
      label: isAuth ? (
        <button
          type='button'
          onClick={handleLogout}
          className='dropdown-link logout-link'
        >
          Logout
        </button>
      ) : (
        <Link to='/login' className='dropdown-link'>
          Sign In
        </Link>
      ),
      key: 'auth',
    },
  ];

  return (
    <Layout className='dashboard-layout'>
      <Header className='dashboard-header'>
        <div className='header-container'>
          <Link to='/' className='dashboard-logo-link'>
            <div className='dashboard-logo'>
              <BriefcaseIcon className='logo-icon' />
              <span className='logo-text'>JobNest</span>
            </div>
          </Link>

          <nav className='dashboard-navigation'>
            <Menu
              theme='light'
              mode='horizontal'
              items={navbarItems}
              selectedKeys={[activePage]}
              className='dashboard-menu'
              onClick={handleMenuKey}
            />
          </nav>

          <div className='header-actions'>
            {!isAuth && (
              <div className='auth-buttons'>
                <Link to='/login' className='btn-login'>
                  Sign In
                </Link>
                <Link to='/register' className='btn-register'>
                  Get Started
                </Link>
              </div>
            )}

            <Dropdown
              menu={{ items }}
              overlayClassName='dashboard-dropdown'
              placement='bottomRight'
            >
              <button
                type='button'
                className='user-avatar-container'
                onClick={e => e.preventDefault()}
              >
                <Avatar
                  data-testid='user-icon'
                  icon={<UserOutlined />}
                  className='user-avatar'
                />
                {isAuth && <span className='welcome-text'>Welcome</span>}
              </button>
            </Dropdown>
          </div>
        </div>
      </Header>

      <Content className='dashboard-content'>
        <Outlet />
      </Content>

      <Footer className='dashboard-footer'>
        <div className='footer-content'>
          <div className='footer-brand'>
            <BriefcaseIcon className='footer-logo' />
            <span className='footer-brand-text'>JobNest</span>
          </div>

          <div className='footer-info'>
            <p className='footer-copyright'>
              © {new Date().getFullYear()} JobNest. All rights reserved.
            </p>
            <p className='footer-creator'>
              Built with ❤️ by <strong>Ayush Sinha</strong>
            </p>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default Navbar;

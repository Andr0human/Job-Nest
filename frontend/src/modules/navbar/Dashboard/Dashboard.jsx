import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Content,
  Dropdown,
  Footer,
  Header,
  Layout,
  Menu,
} from "../../../components";
import { UserOutlined } from "../../../components/Icons";
import { Create as JobCreate, Listing as JobListing } from "../../job";
import { AuthenticationContext } from "../../user";
import { MenuKeyContext } from "../MenuKey/Context";
import "./dashboard.css";

const navbarItems = [
  { key: "jobs", label: <strong>Jobs</strong> },
  { key: "uploads", label: <strong>Uploads</strong> },
];

const componentMap = {
  jobs: <JobListing />,
  uploads: <JobCreate />,
};

const Dashboard = () => {
  const { isAuth } = useContext(AuthenticationContext);
  const { dashboardMenuKey, setDashboardMenuKey } = useContext(MenuKeyContext);

  const handleMenuKey = (e) => {
    sessionStorage.setItem("dashboardMenuKey", e.key);
    setDashboardMenuKey(e.key);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const items = [
    {
      label: <Link to="/profile">Profile</Link>,
      key: "profile",
    },
    {
      label: isAuth ? (
        <Link onClick={handleLogout}>Logout</Link>
      ) : (
        <Link to="/login">Login</Link>
      ),
      key: "auth",
    },
  ];

  return (
    <Layout>
      <Header className="dashboard-header">
        <div className="dashboard-logo">JobNest</div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={navbarItems}
          selectedKeys={dashboardMenuKey}
          className="dashboard-menu"
          onClick={handleMenuKey}
        />
        <Dropdown menu={{ items }} overlayClassName="dashboard-right-menu">
          <Link onClick={(e) => e.preventDefault()}>
            <Avatar data-testid="user-icon" icon={<UserOutlined />} />
          </Link>
        </Dropdown>
      </Header>
      <Content>{componentMap[dashboardMenuKey]}</Content>
      <Footer className="dashboard-footer">
        <div className="dashboard-footer-text">
          JobNest ©{new Date().getFullYear()} Created by Ayush Sinha
        </div>
      </Footer>
    </Layout>
  );
};

export default Dashboard;

import {
  AppstoreOutlined,
  ArrowUpOutlined,
  BankOutlined,
  BarsOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileAddOutlined,
  FilterOutlined,
  FireOutlined,
  HeartOutlined,
  HistoryOutlined,
  InboxOutlined,
  LockOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  StarOutlined,
  UploadOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';

// Custom icon components for better branding
export const BriefcaseIcon = ({ className }) => (
  <BankOutlined className={className} style={{ transform: 'rotate(0deg)' }} />
);

BriefcaseIcon.propTypes = {
  className: PropTypes.string,
};

export const SearchIcon = ({ className }) => (
  <SearchOutlined className={className} />
);

SearchIcon.propTypes = {
  className: PropTypes.string,
};

export const UploadIcon = ({ className }) => (
  <UploadOutlined className={className} />
);

UploadIcon.propTypes = {
  className: PropTypes.string,
};

export const DashboardIcon = ({ className }) => (
  <DashboardOutlined className={className} />
);

DashboardIcon.propTypes = {
  className: PropTypes.string,
};

// Use HeartOutlined as BookmarkOutlined (for saved jobs)
export const BookmarkOutlined = HeartOutlined;

export {
  AppstoreOutlined,
  ArrowUpOutlined,
  BarsOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileAddOutlined,
  FilterOutlined,
  FireOutlined,
  HeartOutlined,
  HistoryOutlined,
  InboxOutlined,
  LockOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
  StarOutlined,
  UploadOutlined,
  UserAddOutlined,
  UserOutlined,
};

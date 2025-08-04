import { useMemo, useState } from 'react';

import {
  Button,
  Content,
  Dropdown,
  Layout,
  Sider,
  Statistic,
  Tag,
} from '../../../components';
import {
  AppstoreOutlined,
  BarsOutlined,
  BookmarkOutlined,
  BriefcaseIcon,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  FireOutlined,
  SortAscendingOutlined,
  UserOutlined,
} from '../../../components/Icons';

import { ListingContext } from './Context';
import JobFilters from './Filters';
import ItemsData from './Items';
import './listing.css';
import SearchBar from './SearchBar';

const Listing = () => {
  const [toFetch, setToFetch] = useState(true);
  const [filters, setFilters] = useState({ salary: [200000, 5000000] });
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const contextValue = useMemo(
    () => ({
      toFetch,
      setToFetch,
      filters,
      setFilters,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setItemsPerPage,
      totalCount,
      setTotalCount,
      viewMode,
      setViewMode,
      sortBy,
      setSortBy,
      savedJobs,
      setSavedJobs,
    }),
    [
      toFetch,
      setToFetch,
      filters,
      setFilters,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setItemsPerPage,
      totalCount,
      setTotalCount,
      viewMode,
      setViewMode,
      sortBy,
      setSortBy,
      savedJobs,
      setSavedJobs,
    ],
  );

  const sortOptions = [
    { key: 'newest', label: 'Newest First', icon: <ClockCircleOutlined /> },
    { key: 'salary', label: 'Highest Salary', icon: <SortAscendingOutlined /> },
    { key: 'relevance', label: 'Most Relevant', icon: <FireOutlined /> },
  ];

  const clearAllFilters = () => {
    setFilters({ salary: [200000, 5000000] });
    setToFetch(true);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.title) count += 1;
    if (filters.jobType?.length) count += 1;
    if (filters.industry?.length) count += 1;
    if (
      filters.salary &&
      (filters.salary[0] !== 200000 || filters.salary[1] !== 5000000)
    )
      count += 1;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Layout className='listing-page-layout'>
      <Content className='listing-page-content'>
        <ListingContext.Provider value={contextValue}>
          {/* Enhanced Hero Section */}
          <div className='listing-hero'>
            <div className='hero-content'>
              <h1 className='hero-title'>Find Your Dream Job</h1>
              <p className='hero-subtitle'>
                Explore thousands of job listings and find your perfect role
              </p>

              {/* Enhanced Stats Section */}
              <div className='hero-stats'>
                <div className='stat-item'>
                  <div className='stat-card'>
                    <BriefcaseIcon className='stat-icon' />
                    <div className='stat-content'>
                      <Statistic
                        value={totalCount || 1247}
                        title='Active Jobs'
                        valueStyle={{
                          color: 'white',
                          fontSize: '1.8rem',
                          fontWeight: '600',
                        }}
                        titleStyle={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                        }}
                      />
                      <span className='stat-trend'>+12% this week</span>
                    </div>
                  </div>
                </div>
                <div className='stat-item'>
                  <div className='stat-card'>
                    <UserOutlined className='stat-icon' />
                    <div className='stat-content'>
                      <Statistic
                        value={250}
                        suffix='+'
                        title='Companies'
                        valueStyle={{
                          color: 'white',
                          fontSize: '1.8rem',
                          fontWeight: '600',
                        }}
                        titleStyle={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                        }}
                      />
                      <span className='stat-trend'>Top employers</span>
                    </div>
                  </div>
                </div>
                <div className='stat-item'>
                  <div className='stat-card'>
                    <EnvironmentOutlined className='stat-icon' />
                    <div className='stat-content'>
                      <Statistic
                        value={50}
                        suffix='+'
                        title='Cities'
                        valueStyle={{
                          color: 'white',
                          fontSize: '1.8rem',
                          fontWeight: '600',
                        }}
                        titleStyle={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                        }}
                      />
                      <span className='stat-trend'>Worldwide</span>
                    </div>
                  </div>
                </div>
              </div>

              <SearchBar />
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className='controls-bar'>
            <div className='controls-left'>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                className={`filter-toggle ${showFilters ? 'active' : ''}`}
              >
                Filters{' '}
                {activeFiltersCount > 0 && (
                  <span className='filter-count'>{activeFiltersCount}</span>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button onClick={clearAllFilters} className='clear-filters-btn'>
                  Clear All
                </Button>
              )}

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className='active-filters'>
                  {filters.title && (
                    <Tag
                      closable
                      onClose={() => {
                        setFilters({ ...filters, title: null });
                        setToFetch(true);
                      }}
                      className='filter-tag'
                    >
                      {filters.title}
                    </Tag>
                  )}
                  {filters.jobType?.map(type => (
                    <Tag
                      key={type}
                      closable
                      onClose={() => {
                        setFilters({
                          ...filters,
                          jobType: filters.jobType.filter(t => t !== type),
                        });
                        setToFetch(true);
                      }}
                      className='filter-tag'
                    >
                      {type}
                    </Tag>
                  ))}
                </div>
              )}
            </div>

            <div className='controls-right'>
              <Dropdown
                menu={{
                  items: sortOptions.map(option => ({
                    key: option.key,
                    label: (
                      <span>
                        {option.icon} {option.label}
                      </span>
                    ),
                    onClick: () => setSortBy(option.key),
                  })),
                }}
                trigger={['click']}
              >
                <Button className='sort-btn'>
                  <SortAscendingOutlined /> Sort by{' '}
                  <span className='sort-value'>
                    {sortOptions.find(option => option.key === sortBy)?.label}
                  </span>
                </Button>
              </Dropdown>

              <div className='view-toggle'>
                <Button
                  icon={<BarsOutlined />}
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                />
                <Button
                  icon={<AppstoreOutlined />}
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  icon={<BookmarkOutlined />}
                  className={viewMode === 'saved' ? 'active' : ''}
                  onClick={() => setViewMode('saved')}
                />
              </div>
            </div>
          </div>

          <Layout className='main-listing-layout'>
            {showFilters && (
              <Sider className='filters-sider' width={280}>
                <JobFilters />
              </Sider>
            )}

            <Content className='jobs-content'>
              <ItemsData />
            </Content>
          </Layout>
        </ListingContext.Provider>
      </Content>
    </Layout>
  );
};

export default Listing;

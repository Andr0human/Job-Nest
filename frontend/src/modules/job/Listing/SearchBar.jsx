import { useContext, useState } from 'react';

import { Button, Dropdown, Input } from '../../../components';
import {
  FilterOutlined,
  SearchIcon,
  StarOutlined,
} from '../../../components/Icons';

import { ListingContext } from './Context';
import './SearchBar.css';

const SearchBar = () => {
  const { filters, setFilters, setToFetch } = useContext(ListingContext);
  const [searchValue, setSearchValue] = useState(filters?.title || '');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [popularSearches] = useState([
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Software Engineer',
    'Data Scientist',
  ]);

  const handleSearch = value => {
    if (value.trim()) {
      setFilters({ ...filters, title: value.trim() });
      setToFetch(true);
    }
  };

  const handleInputChange = e => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleSearch(searchValue);
  };

  // Advanced search filters dropdown
  const advancedFilters = [
    {
      key: 'exact',
      label: (
        <div className='filter-option'>
          <StarOutlined />
          <span>Exact match</span>
        </div>
      ),
    },
    {
      key: 'title',
      label: (
        <div className='filter-option'>
          <span>🎯</span>
          <span>Job title only</span>
        </div>
      ),
    },
    {
      key: 'company',
      label: (
        <div className='filter-option'>
          <span>🏢</span>
          <span>Company name only</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: (
        <div className='filter-option'>
          <span>📝</span>
          <span>Job description</span>
        </div>
      ),
    },
  ];

  return (
    <div className='enhanced-search-container'>
      <div className='search-wrapper'>
        <form onSubmit={handleSubmit} className='input-wrapper'>
          <Input
            type='text'
            placeholder='Search jobs, companies, or locations...'
            value={searchValue}
            onChange={handleInputChange}
            className='chat-input chat-input-large'
          />
          <Button htmlType='submit' className='send-button'>
            <SearchIcon className='send-icon' />
            <span>Find Jobs</span>
          </Button>
        </form>

        {/* Advanced Search Toggle */}
        <Dropdown
          menu={{ items: advancedFilters }}
          trigger={['click']}
          placement='bottomRight'
        >
          <button
            type='button'
            key='advanced-toggle'
            className={`advanced-toggle ${isAdvancedMode ? 'active' : ''}`}
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          >
            <FilterOutlined className='filter-icon' />
            Advanced
          </button>
        </Dropdown>
      </div>

      {/* Popular Searches Tags */}
      <div className='popular-searches'>
        <span className='popular-label'>Popular:</span>
        <div className='popular-tags'>
          {popularSearches.map(term => (
            <Button
              key={`popular-search-${term}`}
              className='tag-button'
              onClick={() => {
                setSearchValue(term);
                handleSearch(term);
              }}
            >
              {term}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

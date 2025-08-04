import { useContext } from 'react';

import { Button, Select, Slider } from '../../../components';
import { FilterOutlined, ReloadOutlined } from '../../../components/Icons';

import { ListingContext } from './Context';
import { industry, jobTypes } from './filtersTypes';

const jobTypeOptions = Object.values(jobTypes).map(value => ({
  label: value,
  value,
  desc: value,
}));

const industryOptions = Object.values(industry).map(value => ({
  label: value,
  value,
  desc: value,
}));

const JobFilters = () => {
  const { setToFetch, filters, setFilters, setCurrentPage, setItemsPerPage } =
    useContext(ListingContext);

  const resetPage = () => {
    setCurrentPage(1);
    setItemsPerPage(5);
  };

  const applyFilters = () => {
    resetPage();
    setToFetch(true);
  };

  const clearFilters = () => {
    setFilters({ salary: [200000, 5000000] });
    resetPage();
    setToFetch(true);
  };

  const formatter = value => `₹${Math.round(value / 100000)}L`;

  return (
    <div className='filter-container'>
      <h3 className='filter-heading'>
        <FilterOutlined />
        <span>Filter Jobs</span>
      </h3>

      <div className='filter-section'>
        <div className='filter-section-title'>Job Type</div>
        <Select
          mode='multiple'
          className='select-container'
          placeholder='Select job types...'
          onChange={value => setFilters({ ...filters, jobType: value })}
          options={jobTypeOptions}
          value={filters.jobType}
          allowClear
          maxTagCount={2}
        />
      </div>

      <div className='filter-section'>
        <div className='filter-section-title'>Industry</div>
        <Select
          mode='multiple'
          className='select-container'
          placeholder='Select industries...'
          onChange={value => setFilters({ ...filters, industry: value })}
          options={industryOptions}
          value={filters.industry}
          allowClear
          maxTagCount={2}
        />
      </div>

      <div className='filter-section'>
        <div className='filter-section-title'>Salary Range</div>
        <Slider
          range
          marks={{
            200000: '₹2L',
            1000000: '₹10L',
            2500000: '₹25L',
            5000000: '₹50L',
          }}
          tooltip={{ formatter }}
          onChange={value => setFilters({ ...filters, salary: value })}
          min={200000}
          max={5000000}
          value={filters.salary}
          step={100000}
        />
      </div>

      <Button
        type='button'
        className='apply-filters-btn'
        onClick={applyFilters}
      >
        Apply Filters
      </Button>

      <Button type='button' className='reset-btn' onClick={clearFilters}>
        <ReloadOutlined />
        <span>Reset All</span>
      </Button>
    </div>
  );
};

export default JobFilters;

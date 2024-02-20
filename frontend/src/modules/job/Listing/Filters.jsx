import { useContext } from "react";
import { Button, Select, Slider, Title } from "../../../components";
import { ListingContext } from "./Context";
import { industry, jobTypes } from "./filtersTypes";

const jobTypeOptions = Object.values(jobTypes).map((value) => ({
  label: value,
  value,
  desc: value,
}));

const industryOptions = Object.values(industry).map((value) => ({
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

  const formatter = (value) => `${Math.round(value / 100000)} lpa`;

  return (
    <div className="filter-container">
      <Title level={5}>Select Job Type</Title>
      <Select
        mode="multiple"
        className="select-container"
        dropdownStyle={{ textAlign: "center" }}
        placeholder="Job Type"
        onChange={(value) => setFilters({ ...filters, jobType: value })}
        optionLabelProp="jobType"
        options={jobTypeOptions}
        value={filters.jobType}
      />

      <Title level={5}>Select Industry</Title>
      <Select
        mode="multiple"
        className="select-container"
        dropdownStyle={{ textAlign: "center" }}
        placeholder="Industry"
        onChange={(value) => setFilters({ ...filters, industry: value })}
        optionLabelProp="industry"
        options={industryOptions}
        value={filters.industry}
      />

      <Title level={5}>Set salary range</Title>
      <Slider
        range
        marks={{ 200000: "2 lpa", 5000000: "50 lpa" }}
        tooltip={{ formatter }}
        onChange={(value) => setFilters({ ...filters, salary: value })}
        min={200000}
        max={5000000}
        value={filters.salary}
      />

      <div className="filter-btn-container">
        <Button onClick={applyFilters} type="primary">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} style={{ marginLeft: 10 }}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;

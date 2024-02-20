import React, { useContext } from "react";
import { Search } from "../../../components";
import { ListingContext } from "./Context";

const SearchBox = () => {
  const { setToFetch, filters, setFilters } = useContext(ListingContext);

  return (
    <div className="filter-searchbar">
      <Search
        placeholder="Search jobs by Title..."
        enterButton="Find Jobs"
        size="large"
        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        style={{ width: "80%" }}
        value={filters.title}
        onSearch={() => setToFetch(true)}
      />
    </div>
  );
};

export default SearchBox;

import React, { useMemo, useState } from "react";
import { ListingContext } from "./Context";
import "./listing.css";
import JobFilters from "./Filters";
import ItemsData from "./Items";
import SearchBar from "./SearchBar";
import { Content, Layout, Sider } from "../../../components";

const Listing = () => {
  const [toFetch, setToFetch] = useState(true);
  const [filters, setFilters] = useState({ salary: [200000, 5000000] });

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
    ]
  );

  return (
    <Content className="listing-container">
      <ListingContext.Provider value={contextValue}>
        <SearchBar />

        <Layout className="listing-inner-layout">
          <Sider style={{ background: "white", borderRadius: 12 }} width={270}>
            <JobFilters />
          </Sider>

          <Content className="listing-content">
            <ItemsData />
          </Content>
        </Layout>
      </ListingContext.Provider>
    </Content>
  );
};

export default Listing;

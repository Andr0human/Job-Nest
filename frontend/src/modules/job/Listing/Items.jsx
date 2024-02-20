import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListItemMeta,
  Popconfirm,
} from "../../../components";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "../../../components/Icons";
import apiInstance from "../../../services/api";
import { AuthenticationContext } from "../../user";
import { ListingContext } from "./Context";

const fields = [
  "_id",
  "title",
  "company",
  "logo",
  "salary",
  "address",
  "description",
];

const ItemsData = () => {
  const { isAuth } = useContext(AuthenticationContext);

  const {
    toFetch,
    setToFetch,
    filters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useContext(ListingContext);

  const [jobListing, setJobListing] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const queryFilters = () => {
    const query = Object.entries(filters).reduce((acc, [key, value]) => {
      const newValue = Array.isArray(value) ? value.join(",") : value;
      return newValue ? { ...acc, [key]: newValue } : acc;
    }, {});

    if (query.salary === "200000,5000000") {
      delete query.salary;
    }

    return query;
  };

  const fetchData = async () => {
    try {
      const response = await apiInstance.get("/jobs/?", {
        params: {
          ...queryFilters(),
          page: currentPage,
          limit: itemsPerPage,
          fields: fields.join(","),
        },
      });

      setJobListing(response.data.data.data);
      setTotalCount(response.data.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setToFetch(false);
    }
  };

  useEffect(() => {
    if (toFetch) {
      fetchData();
    }
  }, [toFetch]);

  const deleteJobListing = async (jobId) => {
    try {
      await apiInstance.delete(`/jobs/${jobId}`);

      setToFetch(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setItemsPerPage(size);
    setToFetch(true);
  };

  return (
    <div className="item-container">
      <List
        itemLayout="vertical"
        size="small"
        className="items-list"
        pagination={{
          showQuickJumper: true,
          size: "small",
          align: "center",
          pageSize: itemsPerPage,
          total: totalCount,
          current: currentPage,
          onChange: handlePageChange,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        dataSource={jobListing}
        renderItem={(item, index) => (
          <ListItem
            key={item.title}
            extra={
              <div>
                <Link to={`/jobs/${item._id}`}>
                  <Button
                    data-testid={`view-button-${index}`}
                    className="item-btn"
                  >
                    <EyeOutlined />
                  </Button>
                </Link>

                {isAuth && (
                  <>
                    <Link to={`/edit/${item._id}`}>
                      <Button
                        data-testid={`edit-button-${index}`}
                        className="item-btn"
                      >
                        <EditOutlined />
                      </Button>
                    </Link>

                    <Popconfirm
                      title="Delete the listing"
                      description="Are you sure to delete this job-listing?"
                      placement="left"
                      onConfirm={() => deleteJobListing(item._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        data-testid={`delete-button-${index}`}
                        className="item-btn"
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </div>
            }
          >
            <ListItemMeta
              avatar={
                <img alt="Logo" src={item.logo} className="items-avatar" />
              }
              title={item.title}
              description={
                <div>
                  <p>{`Company: ${item.company}`}</p>
                  <p>{`Salary: ₹ ${item.salary} / annually`}</p>
                  {item.address && (
                    <p>{`Job Location: ${item.address.city}, ${item.address.state}`}</p>
                  )}
                </div>
              }
            />
            <p>{`Description: ${item.description}`}</p>
          </ListItem>
        )}
      />
    </div>
  );
};

export default ItemsData;

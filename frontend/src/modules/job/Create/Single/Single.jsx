import React, { useContext, useEffect } from "react";
import apiInstance from "../../../../services/api";
import { MenuKeyContext } from "../../../navbar";
import { AuthenticationContext } from "../../../user";
import { UploadForm } from "../../Form";

const SingleUpload = () => {
  const { setDashboardMenuKey } = useContext(MenuKeyContext);
  const { isAuth, authData, setAuthData } = useContext(AuthenticationContext);

  const uploadSuccess = () => {
    setDashboardMenuKey("jobs");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await apiInstance.get("/users/token");

        setAuthData({
          userId: response.data.data._id,
          email: response.data.data.email,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (isAuth) {
      getUser();
    }
  }, [isAuth, setAuthData]);

  return (
      <UploadForm
        formHeading={"Create JobListing"}
        submitMessage="Create Job"
        requestMethod="POST"
        requestApi={`${process.env.REACT_APP_BASE_URL}/jobs`}
        uploadSuccess={uploadSuccess}
        createdBy={authData?.userId}
      />
  );
};

export default SingleUpload;

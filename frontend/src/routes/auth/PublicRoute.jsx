import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { MenuKeyContext } from "../../modules/navbar";
import { AuthenticationContext } from "../../modules/user";
import apiInstance from "../../services/api";

const PublicRoute = ({ children }) => {
  const { setIsAuth } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(true);

  const { setDashboardMenuKey, setUploadMenuKey } = useContext(MenuKeyContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        await apiInstance.get("/users/token");

        setIsAuth(true);
      } catch (error) {
        console.log(error.message);

        localStorage.clear();
        setIsAuth(false);
      } finally {
        setIsLoading(false);

        if (sessionStorage.length === 0) {
          sessionStorage.setItem("dashboardMenuKey", "jobs");
          sessionStorage.setItem("uploadMenuKey", "upload-single");
        }

        setDashboardMenuKey(sessionStorage.getItem("dashboardMenuKey"));
        setUploadMenuKey(sessionStorage.getItem("uploadMenuKey"));
      }
    };

    getUser();
  }, []);

  return isLoading ? null : children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;

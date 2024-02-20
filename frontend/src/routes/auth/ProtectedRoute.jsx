import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiInstance from "../../services/api";
import { AuthenticationContext } from '../../modules/user';

const ProtectedRoute = ({ children }) => {
  const { setIsAuth, setAuthData } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await apiInstance.get("/users/token");

        setIsAuth(true);
        setAuthData({
          userId: response.data.data._id,
          email: response.data.data.email,
        });
      } catch (error) {
        console.log(error);

        localStorage.clear();
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  if (isLoading) {
    return null;
  }

  if (localStorage.getItem("token")) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;

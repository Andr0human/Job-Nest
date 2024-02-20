import PropTypes from 'prop-types';
import { useMemo, useState } from "react";
import { MenuKeyContext } from "./Context";

const MenuKey = ({ children }) => {
  const [dashboardMenuKey, setDashboardMenuKey] = useState("jobs");
  const [uploadMenuKey, setUploadMenuKey] = useState("upload-single");

  const contextValue = useMemo(() => ({
    dashboardMenuKey,
    setDashboardMenuKey,
    uploadMenuKey,
    setUploadMenuKey,
  }), [dashboardMenuKey, setDashboardMenuKey, uploadMenuKey, setUploadMenuKey]);

  return (
    <MenuKeyContext.Provider value={contextValue}>
      {children}
    </MenuKeyContext.Provider>
  );
};

MenuKey.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MenuKey;

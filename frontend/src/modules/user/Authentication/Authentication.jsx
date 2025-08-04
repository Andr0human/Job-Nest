import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import { AuthenticationContext } from './Context';

const Authentication = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [authData, setAuthData] = useState('');

  const contextValue = useMemo(
    () => ({ isAuth, setIsAuth, authData, setAuthData }),
    [isAuth, authData],
  );

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

Authentication.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Authentication;

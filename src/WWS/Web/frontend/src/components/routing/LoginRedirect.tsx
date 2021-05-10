import React from 'react';
import { Redirect } from 'react-router-dom';
import { loginRoute } from '../../constants/routeConstants';

const LoginRedirect: React.FC = () => {
  return (
    <Redirect to={loginRoute} />
  );
};

export default LoginRedirect;

import React from "react";
import {PrivateRouteProps} from "../../types/Routing";
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import {getUser} from "../../services/helperFunctions";
import {User} from "../../types/User";

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, component, ...rest }: PrivateRouteProps) => {
  const user = getUser();
  const canAccessRoute = (user: User): boolean => {
    let result = false;
    user.roles.forEach((r: string) => {
      if (roles.includes(r)) {
        result = true;
      }
    });
    return result;
  }

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => {
        if (user === null) {
          return <Redirect to='/login' />;
        } else if (canAccessRoute(user) && component) {
          return React.createElement(component, props);
        } else {
          return <Redirect to='/' />
        }
      }}
    />
  );
};

export default PrivateRoute;

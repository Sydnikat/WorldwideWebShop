import { RouteProps } from "react-router-dom";

export interface PrivateRouteProps extends RouteProps {
  roles: string[],
  path: string
}

import React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {getUser} from "../../services/helperFunctions";
import {ADMIN, CUSTOMER} from "../../constants/roleConstants";
import CustomerNavbar from "./CustomerNavbar";
import AdminNavbar from "./AdminNavbar";

const NavbarProxy: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const user = getUser();

  if (user === null)
    return(<></>);

  if (user?.roles.includes(ADMIN)) {
    return <AdminNavbar />;
  } else if (user?.roles.includes(CUSTOMER)) {
    return <CustomerNavbar />
  }
  else return <></>;
}

export default withRouter(NavbarProxy);

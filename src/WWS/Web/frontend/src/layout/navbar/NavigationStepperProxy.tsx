import React from "react";
import {getUser} from "../../services/helperFunctions";
import {ADMIN, CUSTOMER} from "../../constants/roleConstants";
import CustomerNavigationStepper from "./CustomerNavigationStepper";
import AdminNavigationStepper from "./AdminNavigationStepper";

const NavigationStepperProxy = () => {
  const user = getUser();

  if (user === null)
    return(<></>);

  if (user?.roles.includes(ADMIN)) {
    return <AdminNavigationStepper />;
  } else if (user?.roles.includes(CUSTOMER)) {
    return <CustomerNavigationStepper />
  }
  else return <></>;
}

export default NavigationStepperProxy;

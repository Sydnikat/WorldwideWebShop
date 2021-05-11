import {Box, Flex, Grid, GridItem} from "@chakra-ui/react";
import React  from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Content from "./Content";

const AuthenticatedLayout: React.FC = ({ children }) => {
  return(
    <>
      {children}
    </>
  );
}

export default AuthenticatedLayout;

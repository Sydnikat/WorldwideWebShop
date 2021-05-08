import {Flex, Grid, GridItem} from "@chakra-ui/react";
import React  from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Content from "./Content";

const AuthenticatedLayout: React.FC = ({ children }) => {
  return(
    <Grid
      height="100vh"
      maxHeight="100vh"
      templateRows="auto 1fr auto"
    >
      <GridItem border="1px" borderColor="red">
        <Navbar />
      </GridItem>
      <GridItem overflow="auto" border="1px" borderColor="red">
        <Content>
          {children}
        </Content>
      </GridItem>
      <GridItem border="1px" borderColor="red">
        <Footer />
      </GridItem>
    </Grid>
  );
}

export default AuthenticatedLayout;

import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {getUser} from "../services/helperFunctions";

const Footer: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  return(
    <Box>
      <Flex alignItems="center" justifyContent="center"  >
        <Text color="white" fontWeight="bold" my="3">
          WorldwideWebShop 2020
        </Text>
      </Flex>
    </Box>
  );
}

export default withRouter(Footer);

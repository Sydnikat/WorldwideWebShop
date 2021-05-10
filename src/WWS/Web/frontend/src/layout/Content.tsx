import {Box, Flex, Grid} from "@chakra-ui/react";
import React from "react";

const Content: React.FC = ({ children }) => {
  return(
    <Box w="80%" mx="auto" overflow="hidden" minHeight="100%">
      {children}
    </Box>
  );
}

export default Content;

import {Box, Flex} from "@chakra-ui/react";
import React from "react";

const Content: React.FC = ({ children }) => {
  return(
    <Box w="80%" mx="auto">
      {children}
    </Box>
  );
}

export default Content;

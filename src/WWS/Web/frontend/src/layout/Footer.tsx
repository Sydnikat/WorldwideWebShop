import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
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

export default Footer;

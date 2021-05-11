import {Box, Flex} from "@chakra-ui/react";
import React from "react";

interface OrderDetailProps {
  title: string;
  value: string;
}

const OrderDetail = (props: OrderDetailProps) => {
  const {title, value} = props;
  return(
    <Box w="100%" overflow="hidden" mb="1">
      <Flex alignItems="center" justifyContent="start" my="auto"  mx="3%" w="90%" grow={1}>
        <Box as="span" color="gray.600" fontSize="lg" minWidth="30%">
          {title}
        </Box>
        <Box
          my="auto"
          ml="auto"
          fontWeight="bold"
          fontSize="lg"
          color="gray.600"
          textAlign="end"
        >
          {value}
        </Box>
      </Flex>
    </Box>
  );
}

export default OrderDetail;

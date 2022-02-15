import {OrderItemResponse} from "../../types/dto/Order";
import {Box, Divider, Flex, Image, Stack} from "@chakra-ui/react";
import React from "react";

interface OrderItemProps {
  orderItem: OrderItemResponse
}

const property = {
  imageUrl: "https://images-na.ssl-images-amazon.com/images/I/71z7ztyH1LL._AC_SX466_.jpg",
  imageAlt: "Árucikk képe"
};

const OrderItem = (props: OrderItemProps) => {
  const {orderItem} = props;

  return(
    <Box w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="sm" pb="4" mb="1">
      <Flex alignItems="center" justifyContent="start"  mx="3%" w="90%" mt="3%" grow={1}>
        <Flex
          w="20%"
          grow={1}
          alignItems="center" justifyContent="space-evenly"
          backgroundColor="white"
        >
          <Image
            h="100%"
            boxSize="100px"
            objectFit="cover"
            src={property.imageUrl}
            alt={property.imageAlt}
          />
        </Flex>
        <Divider w="5%" />

        <Flex
          w="50%"
          fontWeight="semibold"
          lineHeight="tight"
          minHeight="100%"
        >
          <Flex grow={1} direction="column">
            <Flex h="20%" alignItems="center" justifyContent="center" ml="5%" mt="5%" mb="3%">
              <Box as="span" fontSize="xl" color="gray.600" minWidth="25%" maxWidth="50%">
                {orderItem.name}
              </Box>
            </Flex>

            <Flex h="20%" my="3%" alignItems="center" justifyContent="space-evenly" ml="5%">
              <Box as="span" color="gray.600" fontSize="lg">
                {"Online ár:"}
              </Box>
              <Box
                ml="auto"
                fontWeight="bold"
                fontSize="lg"
                color="gray.600"
              >
                {orderItem.price} Ft
              </Box>
            </Flex>

            <Flex h="20%" my="3%" alignItems="center" justifyContent="space-evenly" ml="5%">
              <Box as="span" color="gray.600" fontSize="lg">
                {"Mennyiség:"}
              </Box>
              <Box
                ml="auto"
                fontWeight="bold"
                fontSize="lg"
                color="gray.600"
              >
                {orderItem.count} db
              </Box>
            </Flex>

          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default OrderItem;

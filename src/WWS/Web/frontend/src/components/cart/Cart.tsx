import {Badge, Box, Button, Image, Text, Flex, Center, Tag, Spacer, Heading, ButtonGroup, IconButton } from "@chakra-ui/react";
import {AddIcon, MinusIcon, StarIcon} from "@chakra-ui/icons";
import React, { Fragment } from "react";
import CartItem from "./CartItem";

const Cart = () => {

  const property = {
    formattedPrice: "19 000"
  }

  return (
    <Box w={400} overflow="hidden" border="2px" borderColor="red" p="2">


      <Flex alignItems="center" mb="2">
        <Center>
          <Heading size="md" fontWeight="semibold">
            Kosár tartalma
          </Heading>
        </Center>
        <Center ml="auto" mr={2}>
          <Button borderRadius="xl" colorScheme="red" variant="ghost">
            Kosár törlése
          </Button>
        </Center>
      </Flex>

      {Array(2)
        .fill("")
        .map((_, i) => (
          <Fragment key={i}>
            <CartItem />
          </Fragment>
        ))}

      <Flex alignItems="center" justifyContent="start"  mx="3%" w="90%" my="5%">
        <Box w="50%">
          <Box>
            <Text fontSize="sm">
              Összesen
            </Text>
          </Box>
          <Box>
            <Text fontSize="xl" color="grey" fontWeight="bold">
              {property.formattedPrice} Ft
            </Text>
          </Box>
        </Box>
        <Box w="50%">
          <Button w="100%" borderRadius="full" colorScheme="red" variant="solid">
            Fizetés
          </Button>
        </Box>
      </Flex>

    </Box>
  )
}

export default Cart;

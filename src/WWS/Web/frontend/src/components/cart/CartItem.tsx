import {Box, ButtonGroup, Center, Flex, IconButton, Image, Tag, Text} from "@chakra-ui/react";
import {AddIcon, MinusIcon} from "@chakra-ui/icons";
import React from "react";

const CartItem = () => {
  const property = {
    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/71z7ztyH1LL._AC_SX466_.jpg",
    imageAlt: "Árucikk képe",
    title: "Árucikk neve gffz kufk kufkk fffo ds dfljags l g lg slgdlg dslglkjhlsd  dlakjhgj khsd djsdh htfkhfk zfjhk",
    formattedPrice: "19 000",
    count: 1
  };

  return(
    <Box mx="3%" w="94%" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="sm" pb="4" mb="1">
      <Flex alignItems="center" justifyContent="start"  mx="3%" w="90%" mt="3%">
        <Box w="30%">
          <Image src={property.imageUrl} alt={property.imageAlt} />
        </Box>
        <Box
          ml="5%"
          w="70%"
          fontWeight="semibold"
          lineHeight="tight"
        >
          {property.title}
        </Box>
      </Flex>

      <Flex alignItems="center" justifyContent="start" mx="auto" w="70%" mt="3%">
        <ButtonGroup size="sm" isAttached variant="outline" mr="2">
          <IconButton aria-label="Add to friends" icon={<MinusIcon />} />
        </ButtonGroup>
        <Tag borderRadius="full" p="1" w="20%" >
          <Text mx="auto">
            {property.count} db
          </Text>
        </Tag>
        <ButtonGroup size="sm" isAttached variant="outline" ml="2">
          <IconButton aria-label="Add to friends" icon={<AddIcon />} />
        </ButtonGroup>
        <Center ml="5">
          <Text fontSize="lg">
            {property.formattedPrice} Ft
          </Text>
        </Center>
      </Flex>
    </Box>
  );
}

export default CartItem;

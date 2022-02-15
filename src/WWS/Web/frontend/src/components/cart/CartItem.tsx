import {Box, ButtonGroup, Center, Divider, Flex, IconButton, Image, Tag, Text, useToast} from "@chakra-ui/react";
import {AddIcon, MinusIcon} from "@chakra-ui/icons";
import React from "react";
import {CartItemResponse, UpdateCartRequest} from "../../types/dto/Cart";
import {useMutation, useQueryClient} from "react-query";
import {deleteMyCart, updateMyCart} from "../../services/queries";
import {AxiosError} from "axios";
import {WWSError} from "../../types/dto/Error";

interface CartItemProps {
  cartItem: CartItemResponse
}

const CartItem = (props: CartItemProps) => {
  const {cartItem} = props;
  const property = {
    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/71z7ztyH1LL._AC_SX466_.jpg",
    imageAlt: "Árucikk képe"
  };
  const client = useQueryClient();
  const toast = useToast();
  const {mutateAsync: updateCart} = useMutation(updateMyCart, {
    onSuccess: async () => {
      await client.invalidateQueries("cart");
    },
    onError: (error: AxiosError<WWSError>) => {
      const response = error.response;
      const status = response?.status;
      if (status === 401 || status === 400) {
        let errorText = "Hiba a mentés során...";
        if (response !== undefined && response.data !== undefined && response.data.message !== undefined) {
          errorText = response.data.message
        }
        toast({
          title: `${errorText}`,
          position: "top-right",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    }
  });

  const increaseCount = async () => {
    const request: UpdateCartRequest = {
      itemId: cartItem.itemId,
      count: cartItem.count + 1
    }
    try {
      await updateCart(request);
    } catch (e) {}
  };

  const decreaseCount = async () => {
    if (cartItem.count - 1 < 0)
      return;

    const request: UpdateCartRequest = {
      itemId: cartItem.itemId,
      count: cartItem.count - 1
    }
    try {
      await updateCart(request);
    } catch (e) {}
  };

  return(
    <Box mx="3%" w="94%" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="sm" pb="4" mb="1">
      <Flex alignItems="center" justifyContent="start"  mx="3%" w="90%" mt="3%">
        <Box w="30%">
          <Image src={property.imageUrl} alt={property.imageAlt} />
        </Box>
        <Divider w="20%" />
        <Box
          ml="5%"
          w="50%"
          fontWeight="semibold"
          lineHeight="tight"
        >
          {cartItem.name}
        </Box>
      </Flex>

      <Flex alignItems="center" justifyContent="start" mx="auto" w="70%" mt="3%">
        <ButtonGroup size="sm" isAttached variant="outline" mr="2" onClick={decreaseCount}>
          <IconButton aria-label="Add to friends" icon={<MinusIcon />} />
        </ButtonGroup>
        <Tag borderRadius="full" p="1" w="20%" >
          <Text mx="auto">
            {cartItem.count} db
          </Text>
        </Tag>
        <ButtonGroup size="sm" isAttached variant="outline" ml="2" onClick={increaseCount}>
          <IconButton aria-label="Add to friends" icon={<AddIcon />} />
        </ButtonGroup>
        <Center ml="5">
          <Text fontSize="lg">
            {cartItem.price} Ft
          </Text>
        </Center>
      </Flex>
    </Box>
  );
}

export default CartItem;

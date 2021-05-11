import {
  Badge,
  Box,
  Button,
  Image,
  Text,
  Flex,
  Center,
  Tag,
  Spacer,
  Heading,
  ButtonGroup,
  IconButton,
  Spinner, useToast
} from "@chakra-ui/react";
import {AddIcon, MinusIcon, StarIcon} from "@chakra-ui/icons";
import React, { Fragment } from "react";
import CartItem from "./CartItem";
import {useMutation, useQuery} from "react-query";
import {ItemResponse} from "../../types/InventoryItem";
import {WWSError} from "../../types/Error";
import {checkoutMyCart, deleteMyCart, getItem, getMyCart, updateMyCart} from "../../services/queries";
import {CartItemResponse, CartResponse} from "../../types/Cart";
import {AxiosError} from "axios";
import {inspectRoute, orderRoute} from "../../constants/routeConstants";
import {useHistory} from "react-router-dom";

const Cart = () => {
  const toast = useToast();
  const history = useHistory();
  const { data, refetch } = useQuery<CartResponse, WWSError>("cart", () => getMyCart(), {retry: 1});

  const {mutateAsync: deleteCart} = useMutation(deleteMyCart, {
    onSuccess: async () => {
      await refetch();
    },
    onError: (error: AxiosError<WWSError>) => {
      const response = error.response;
      const status = response?.status;
      if (status === 401 || status === 400) {
        let errorText = "Hiba a törlés során...";
        if (response !== undefined && response.data !== undefined && response.data.message !== undefined) {
          errorText = response.data.message
        }
        toast({
          title: `${errorText}`,
          position: "top-right",
          status: "error",
          isClosable: true,
          duration: 4000,
        });
      }
    }
  });

  const {mutateAsync: checkoutCart, isLoading: executingCheckout} = useMutation(checkoutMyCart, {
    onSuccess: async (order) => {
      history.push(`${orderRoute}/${order.orderCode}`)
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
          duration: 5000,
        });
      }
    }
  });

  const checkout = async () => {
    if (data === undefined)
      return;

    await checkoutCart();
  }

  const emptyTheCart = async () => {
    try {
      await deleteCart();
    } catch (e) {}
  };

  if (executingCheckout) {
    return (
      <Box w={400} overflow="hidden" py="10%">
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </Box>
    )
  }

  if (data === undefined) {
    return (
      <Box w={400} overflow="hidden" py="10%">
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </Box>
    )
  }

  if (data.items.length === 0) {
    return (
      <Box w="100%" h="auto" overflow="hidden" my="20%">
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Heading size="md" color="grey">
            A kosár üres...
          </Heading>
        </Flex>
      </Box>
    )
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
          <Button borderRadius="xl" colorScheme="red" variant="ghost" onClick={emptyTheCart}>
            Kosár törlése
          </Button>
        </Center>
      </Flex>

      {data.items.map((i: CartItemResponse, idx: number) => (
        <Fragment key={`cartItem_${idx}`}>
          <CartItem cartItem={i} />
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
              {data.totalPrice} Ft
            </Text>
          </Box>
        </Box>
        <Box w="50%">
          <Button w="100%" borderRadius="full" colorScheme="red" variant="solid" onClick={checkout}>
            Fizetés
          </Button>
        </Box>
      </Flex>

    </Box>
  )
}

export default Cart;

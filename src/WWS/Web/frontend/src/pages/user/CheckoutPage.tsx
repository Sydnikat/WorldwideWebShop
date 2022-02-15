import React, {Fragment, useState} from "react";
import {RouteComponentProps, useHistory} from "react-router-dom";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import {
  Box,
  Button, ButtonGroup, Center, Divider,
  Flex,
  FormControl,
  Heading, IconButton, Image,
  Input,
  InputGroup,
  InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner,
  Stack, Tag, Text, Tooltip,
  useToast
} from "@chakra-ui/react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {CartResponse} from "../../types/dto/Cart";
import {WWSError} from "../../types/dto/Error";
import {checkoutMyCart, deleteMyCart, finishMyOrder, getMyCart, getMyOrder} from "../../services/queries";
import {AxiosError} from "axios";
import {OrderItemResponse, OrderResponse} from "../../types/dto/Order";
import UserAddress from "../../components/user/UserAddress";
import {AddIcon, MinusIcon, QuestionOutlineIcon, StarIcon} from "@chakra-ui/icons";
import OrderItem from "../../components/order/OrderItem";
import UserProfile from "../../components/user/UserProfile";
import OrderDetail from "../../components/order/OrderDetail";
import {homeRoute, orderRoute} from "../../constants/routeConstants";

interface CheckoutPageParams {
  orderId: string;
}

const CheckoutPage: React.FC<RouteComponentProps<CheckoutPageParams>> = (props: RouteComponentProps<CheckoutPageParams>) => {
  const {orderId} = props.match.params;
  const toast = useToast();
  const history = useHistory();
  const client = useQueryClient();

  const [email, setEmail] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const {mutateAsync: finishOrder, isLoading} = useMutation(finishMyOrder, {
    onSuccess: async (order) => {
      await client.invalidateQueries("chosenCategory");
      await client.invalidateQueries("cart");
      history.push(`${homeRoute}`);
      toast({
        title: `Sikeres vásárlás`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
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

  const { data: order, refetch } = useQuery<OrderResponse, WWSError>(
    "activeOrder",
    () => getMyOrder(orderId),
    {
      retry: 1,
      onSuccess: data => {
        setZip(data.zip);
        setStreet(data.street);
        setCity(data.city);
        setEmail(data.email);
        setPhone(data.phone);
      }
    });

  const finish = async () => {
    if (order !== undefined) {
      await finishOrder(order.orderCode);
    }
  };

  const onModalClose = async () => {
    if (!isLoading) {
      setModalIsOpen(false);
    }
  }

  const onOrderClick = async () => {
    if (order !== undefined) {
      setModalIsOpen(true);
    }
  }

  if (order === undefined) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </AuthenticatedLayout>
    )
  }

  return(
    <AuthenticatedLayout>
      <Flex
        mt="1%"
        flexDirection="column"
        backgroundColor="gray.100"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Box minWidth="700px" >
            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="white"
                boxShadow="md"
              >
                <Heading w="100%" textAlign="center">
                  Kiválasztott termékek
                </Heading>

                {order.items.map((i: OrderItemResponse, idx: number) => (
                  <Fragment key={`orderItem_${idx}`}>
                    <OrderItem orderItem={i} />
                  </Fragment>
                ))}

                <Heading w="100%" textAlign="center">
                  Rendelés adatok
                </Heading>

                <OrderDetail
                  title={"Teljes össeg:"}
                  value={`${order.totalPrice} FT`}
                />

                <OrderDetail
                  title={"Címzett:"}
                  value={order.customerName}
                />

                <OrderDetail
                  title={"Rendelés azonosító:"}
                  value={order.orderCode}
                />


                <Heading w="100%" textAlign="center">
                  Szállítási adatok
                </Heading>

                <UserProfile
                  zip={zip}
                  street={street}
                  city={city}
                  email={email}
                  phone={phone}
                  setZip={setZip}
                  setCity={setCity}
                  setStreet={setStreet}
                  setEmail={setEmail}
                  setPhone={setPhone}
                />

                <Flex alignItems="center" justifyContent="center">
                  <Button
                    w="80%"
                    borderRadius="full"
                    colorScheme="red"
                    variant="solid"
                    width="full"
                    disabled={isLoading}
                    onClick={finish}
                  >
                    {isLoading ? <Spinner /> : "Megrendelem"}
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </AuthenticatedLayout>
  );
}

export default CheckoutPage;

import ItemCard from "../../components/item/ItemCard";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {axiosInstance} from "../../services/config/axios";
import {
  getCategory,
  getItem,
  getItemReviews,
  getItemsOfCategory,
  getMyCart,
  login,
  updateMyCart
} from "../../services/queries";
import {WWSError} from "../../types/dto/Error";
import {ItemResponse} from "../../types/dto/InventoryItem";
import {CategoryResponse} from "../../types/dto/Category";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import React, {useContext, useEffect, useState} from "react";
import {
  Badge,
  Box, Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Progress,
  Spinner,
  Tag,
  Text, Textarea, Tooltip, useToast
} from "@chakra-ui/react";
import {RouteComponentProps, useHistory} from "react-router-dom";
import {AddIcon, MinusIcon, StarIcon, QuestionOutlineIcon, CloseIcon} from "@chakra-ui/icons";
import {CUSTOMER} from "../../constants/roleConstants";
import {homeRoute, notFoundRoute} from "../../constants/routeConstants";
import {AxiosError} from "axios";
import {CartResponse, UpdateCartRequest} from "../../types/dto/Cart";
import {ReviewResponse} from "../../types/dto/Review";
import Review from "../../components/item/Review";
import NewReviewForm from "../../components/item/NewReviewForm";
import ReviewSummary from "../../components/item/ReviewSummary";
import ReviewList from "../../components/item/ReviewList";
import CustomerNavigationStepper from "../../layout/navbar/CustomerNavigationStepper";
import {NavigationContext} from "../../providers/NavigationContext";
import NavigationStepperProxy from "../../layout/navbar/NavigationStepperProxy";

const test = {
  imageUrl: "https://images-na.ssl-images-amazon.com/images/I/71z7ztyH1LL._AC_SX466_.jpg",
  imageAlt: "Árucikk képe",
  title: "Árucikk neve",
  formattedPrice: "19 000",
  reviewCount: 34,
  rating: 4,
  discount: true
}

interface ItemPageParams {
  itemId: string;
}

const ItemPage: React.FC<RouteComponentProps<ItemPageParams>> = (props: RouteComponentProps<ItemPageParams>) => {
  const {itemId} = props.match.params;
  const client = useQueryClient();
  const history = useHistory();
  const toast = useToast();
  const [inTransaction, setInTransaction] = useState<boolean>(false);
  const [newCount, setNewCount] = useState<number>(1);
  const [myRating, setMyRating] = useState<number>(0);

  const {setChosenItem} = useContext(NavigationContext);

  const { isLoading, error, data } = useQuery<ItemResponse, AxiosError<WWSError>>(
    ['items', itemId], () => getItem(parseInt(itemId, 10)),
    {
      retry: 1,
      onSuccess: (item: ItemResponse) => {
        setChosenItem(item);
      },
      onError: (error: AxiosError<WWSError>) => {
        const err = error.response!!.data as WWSError;
        if (err.statusCode === 404) {
          let errorText = "Hiba...";
          if (err.message !== undefined) {
            errorText = err.message
          }
          toast({
            title: `${errorText}`,
            position: "top-right",
            status: "error",
            isClosable: true,
            duration: 3000,
          });

          history.push(`${notFoundRoute}`);
        }
      }
    });

  const { data: cart, refetch: refetchCart } = useQuery<CartResponse, AxiosError<WWSError>>(
    "cart",
    () => getMyCart()
  );

  const {mutateAsync: updateCart} = useMutation(updateMyCart, {
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
    },
    onSettled: (data, error) => {
      setInTransaction(false);
      setNewCount(1);
    }
  });

  const putItemIntoCart = async () => {
    const request: UpdateCartRequest = {
      itemId: parseInt(itemId, 10),
      count: newCount
    }
    await refetchCart();
    if (cart !== undefined) {
      const item = cart.items.find(i => i.itemId === request.itemId);
      if (item !== undefined) {
        request.count = request.count + item.count;
      }
    }
    try {
      setInTransaction(true);
      await updateCart(request);
    } catch (e) {}
  }

  if (data === undefined) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </AuthenticatedLayout>
    )
  }

  const increaseCount = () => {
    if (data.stock > newCount) {
      setNewCount(newCount + 1);
    }
  }

  const decreaseCount = () => {
    if (newCount - 1 > 0) {
      setNewCount(newCount - 1);
    }
  }

  const rating = data.rating !== null ? data.rating : 0;

  return(
    <AuthenticatedLayout>
      <NavigationStepperProxy />
      <Box mx="3%" w="94%" borderWidth="1px" borderRadius="lg" overflow="hidden" bg="#fafafa" boxShadow="sm" pb="4" mb="1">
        <Flex alignItems="center" justifyContent="start"  mx="3%" w="90%" mt="3%" grow={1}>
          <Flex
            w="45%"
            grow={1}
            alignItems="center" justifyContent="space-evenly"
            backgroundColor="white"
            borderWidth="1px"
            borderRadius="md"
          >
            <Image h="100%" src={test.imageUrl} alt={test.imageAlt} />
          </Flex>
          <Divider w="5%" />

          <Flex
            w="50%"
            fontWeight="semibold"
            lineHeight="tight"
            minHeight="100%"
          >
            <Flex grow={1} direction="column">
              <Box ml="15%" h="full" mb="5%">
                <Flex h="20%" alignItems="center" justifyContent="start" ml="5%" mt="5%" mb="3%">
                  <Heading as="h1" maxWidth="50%">
                    {data.name}
                  </Heading>
                  <Heading mx="5%" > - </Heading>
                  <Flex alignItems="center" justifyContent="start" minWidth="45%" minHeight="100%">
                    <Box as="span" color="gray.600" fontSize="xl">
                      {data.description}
                    </Box>
                  </Flex>
                </Flex>

                <Flex h="10%" my="3%" alignItems="center" justifyContent="start" ml="5%">
                  <Box d="flex" alignItems="center">
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          color={i < rating ? "teal.500" : "gray.300"}
                        />
                      ))}
                    <Box as="span" ml="2" color="gray.600" fontSize="sm">
                      {data.ratingCount} Vélemények
                    </Box>
                  </Box>
                </Flex>

                <Flex h="10%" my="3%" alignItems="center" justifyContent="start" ml="5%">
                  <Heading
                    size="md"
                    fontWeight="semibold"
                    w="25%"
                    textAlign="start"
                    textDecoration={data.discountId !== null ? "line-through" : "none"}
                  >
                    Listaár:
                  </Heading>
                  <Heading
                    size="md"
                    fontWeight="semibold"
                    w="75%"
                    textAlign="start"
                    textDecoration={data.discountId !== null ? "line-through" : "none"}
                  >
                    {data.originalPrice} Ft
                  </Heading>
                </Flex>

                <Flex h="20%" my="3%" alignItems="center" justifyContent="start" ml="5%">
                  <Heading
                    size="md"
                    fontWeight="semibold"
                    w="25%"
                    textAlign="start"
                  >
                    Online ár:
                  </Heading>
                  <Flex
                    fontWeight="bold"
                    w="75%"
                    textAlign="start"
                    color="teal.500"
                    justifyContent="start"
                    alignItems="center"
                  >
                    <Heading
                      as="h3"
                    >
                      {data.price} Ft
                    </Heading>
                    <Tooltip
                      placement="right"
                      label="Kizárólag a webáruházunkban leadott megrendelésekre biztosítjuk."
                    >
                      <Text ml="5%" size="lg">
                        <QuestionOutlineIcon  />
                      </Text>
                    </Tooltip>
                  </Flex>
                </Flex>

                <Flex h="10%" my="3%" alignItems="center" justifyContent="start" ml="5%">
                  <Heading
                    size="md"
                    fontWeight="semibold"
                    w="25%"
                    textAlign="start"
                  >
                    Készleten:
                  </Heading>
                  <Heading
                    size="md"
                    fontWeight="semibold"
                    w="75%"
                    textAlign="start"
                    color={data.stock <= data.lowLevel ? "crimson" : "black"}
                  >
                    {data.stock} db
                  </Heading>
                </Flex>
              </Box>

              <Flex alignItems="center" justifyContent="center" grow={1} mx="auto" w="70%" h="15%">

                <Box as="button" py="2%" w="15%" mr="2" borderRadius="full" bg="#e9e9e9">
                  <div  onClick={decreaseCount}>
                    <MinusIcon />
                  </div>
                </Box>
                <Tag borderRadius="full" border="1px" borderColor="black" p="1" my="5%" w="30%" colorScheme="grey.600" >
                  <Text w="100%" mx="auto" my="5%" textAlign="center">
                    {newCount} db
                  </Text>
                </Tag>
                <Box as="button" py="2%" w="15%" ml="2" borderRadius="full" bg="#e9e9e9">
                  <div onClick={increaseCount}>
                    <AddIcon />
                  </div>
                </Box>
              </Flex>

              <Flex alignItems="center" justifyContent="center" grow={1} mx="auto" w="70%" h="15%" my="5%">
                <Button
                  w="70%"
                  borderRadius="full"
                  colorScheme="red"
                  variant="solid"
                  disabled={inTransaction || newCount > data.stock}
                  onClick={putItemIntoCart}
                >
                  Kosárba
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex mx="3%" mt="3%" alignItems="center" justifyContent="center">
          <ReviewList itemId={data.id} />
        </Flex>

      </Box>


    </AuthenticatedLayout>
  );
}

export default ItemPage;

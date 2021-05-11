import {Box, Button, Drawer,
  DrawerContent,
  DrawerOverlay, Flex, Icon, Input, InputGroup, InputRightElement, Popover, PopoverBody,
  PopoverCloseButton,
  PopoverContent, PopoverTrigger, Select, Text, Tooltip, useDisclosure} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import {Link, RouteComponentProps, useHistory, withRouter} from "react-router-dom";
import {homeRoute, loginRoute, profileRoute} from "../constants/routeConstants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUserAlt, faSearch, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {FocusableElement} from "@chakra-ui/utils";
import Cart from "../components/cart/Cart";
import {useQuery, useQueryClient} from "react-query";
import {WWSError} from "../types/Error";
import {getCategories, getCategory, getItemsOfCategory} from "../services/queries";
import {CategoryResponse} from "../types/Category";
import {cleanUser, getUser} from "../services/helperFunctions";
import {ItemResponse} from "../types/InventoryItem";
import UserProfile from "../components/user/UserProfile";
import ModifyProfile from "../components/user/ModifyProfile";

const Navbar: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const [chosenCategory, setChosenCategory] = useState(-1);
  const [canUpdate, setCanUpdate] = useState<boolean>(true);
  const history = useHistory();
  const client = useQueryClient();

  const { isLoading, error, data, isSuccess } = useQuery<CategoryResponse[], WWSError>('categories',getCategories, {retry: 1});
  const { data: items, refetch: refetchItems } = useQuery<ItemResponse[], WWSError>('items', () => getItemsOfCategory(chosenCategory));

  const {refetch, data: chosen} = useQuery(
    'chosenCategory',
    () => getCategory(chosenCategory),
    {
      retry: false,
      onError: err => {
        client.setQueryData<CategoryResponse>("chosenCategory", {id: -1, name: ""} as CategoryResponse);
      },
      onSuccess: async () => {
        setCanUpdate(false);
      },
      enabled: canUpdate
    });

  useEffect(() => {
    if (chosen !== undefined && chosen.id !== chosenCategory) {
      refetch();
      refetchItems();
      setCanUpdate(true);
    }
  }, [chosenCategory]);

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="flex-end"  bg="blue.300" />
    );
  }

  const onCategorySelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    setChosenCategory(parseInt(idStr, 10));
    history.push(homeRoute);
  }

  const generateCategoriesList = () => {
    if (data === undefined) return <></>;
    return (
      <>
        <option key={`cat_null`} value={-1}>Összes kategória</option>
        {data.map((c: CategoryResponse, i: number) => (
          <option key={`cat_${i}`} value={c.id}>{c.name}</option>
        ))}
      </>
    )
  }

  const logout = () => {
    cleanUser();
    history.push(loginRoute);
  };

  return(
    <Box  bg="blue.300">
      <Flex alignItems="center" justifyContent="flex-end" w="90%" mx="auto">
        <Flex h="100%" w="300px" alignItems="center" ml="2%" mr="5%" >
          <Select
            value={chosenCategory}
            onChange={onCategorySelectChange}
            bg="white"
          >
            {generateCategoriesList()}
          </Select>
        </Flex>

        <Flex h="100%" w="40%" alignItems="center" ml="auto" mr="auto" >
          <InputGroup borderRadius="full" bg="white" size="lg">
            <Input
              pr="4.5rem"
              type="text"
              borderRadius="full"
              placeholder="Keresés.."
            />
            <InputRightElement width="5rem">
              <Button h="100%" width="full">
                <FontAwesomeIcon
                  icon={faSearch}
                />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>

        <Flex h="100px" w="10%" alignItems="center" ml="5%" >
          <Popover
            isLazy
            trigger="click"
          >
            <PopoverTrigger>

                <Button w="100%" h="100%" colorScheme="blue.300" _hover={{ bg: "blue.500" }} variant="solid">
                  <FontAwesomeIcon
                    icon={faUserAlt}
                    size={"4x"}
                    color="white"
                  />
                </Button>

            </PopoverTrigger>
            <PopoverContent minWidth="500px">
              <ModifyProfile />
            </PopoverContent>
          </Popover>
        </Flex>

        <Flex h="100px" w="10%" alignItems="center" >
          <Popover
            isLazy
            trigger="hover"
          >
            <PopoverTrigger>
              <Button w="100%" h="100%" colorScheme="blue.300" _hover={{ bg: "blue.500" }} variant="solid">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  size={"4x"}
                  color="white"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent minWidth="400px">
              <Cart />
            </PopoverContent>
          </Popover>
        </Flex>

        <Flex h="100px" w="10%" alignItems="center" >
          <Tooltip label="Kijelentkezés" fontSize="md" placement="left" >
            <Button w="100%" h="100%" onClick={logout} colorScheme="blue.300" _hover={{ bg: "blue.500" }} variant="solid">
              <FontAwesomeIcon
                icon={faSignOutAlt}
                size={"4x"}
                color="white"
              />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
}

export default withRouter(Navbar);

import {Box, Button, Drawer,
  DrawerContent,
  DrawerOverlay, Flex, Icon, Input, InputGroup, InputRightElement, Popover, PopoverBody,
  PopoverCloseButton,
  PopoverContent, PopoverTrigger, Select, Text, Tooltip, useDisclosure} from "@chakra-ui/react";
import React, {useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {homeRoute, loginRoute, profileRoute} from "../constants/routeConstants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUserAlt, faSearch, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {FocusableElement} from "@chakra-ui/utils";
import Cart from "../components/cart/Cart";
import {useQuery} from "react-query";
import {WWSError} from "../types/Error";
import {getCategories} from "../services/queries";
import {CategoryResponse} from "../types/Category";
import {cleanUser} from "../services/helperFunctions";

const Navbar = () => {
  const { isLoading, error, data, isSuccess } = useQuery<CategoryResponse[], WWSError>('categories',getCategories, {retry: 1});
  const [chosenCategory, setChosenCategory] = useState("-1");
  const history = useHistory();

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="flex-end"  bg="blue.300" />
    );
  }

  const onCategorySelectChange = (e:  React.ChangeEvent<HTMLSelectElement>) => {
    setChosenCategory(e.currentTarget.value);
  }

  const generateCategoriesList = () => {
    if (data === undefined) return <></>;
    return (
      <>
        {data.map((c: CategoryResponse, i: number) => (
          <option key={`cat_${i}`} value={c.id}>{c.name}</option>
        ))}
      </>
    )
  }

  console.log(chosenCategory);

  const logout = () => {
    cleanUser();
    history.push(loginRoute);
  };

  return(
    <Box  bg="blue.300">
      <Flex alignItems="center" justifyContent="flex-end" w="90%" mx="auto">
        <Flex h="100%" w="300px" alignItems="center" ml="2%" mr="5%" >
          <Select onChange={onCategorySelectChange} bg="white" placeholder="Válasszon a kategóriákból...">
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
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm">
                <FontAwesomeIcon
                  icon={faSearch}
                />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>

        <Flex h="100px" w="10%" alignItems="center" ml="5%" >
          <Tooltip label="Profil megtekintése" fontSize="md" placement="left" >
            <Button w="100%" h="100%" colorScheme="blue.300" _hover={{ bg: "blue.500" }} variant="solid">
              <FontAwesomeIcon
                icon={faUserAlt}
                size={"4x"}
                color="white"
              />
            </Button>
          </Tooltip>
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

export default Navbar;

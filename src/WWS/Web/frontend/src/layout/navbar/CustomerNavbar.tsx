import {Box, Button, Flex, Popover,
  PopoverContent, PopoverTrigger, Select, Text, Tooltip} from "@chakra-ui/react";
import React, {ChangeEvent, Fragment, KeyboardEvent, useContext, useEffect, useState} from "react";
import {RouteComponentProps, useHistory, withRouter} from "react-router-dom";
import {homeRoute, loginRoute, profileRoute, searchRoute} from "../../constants/routeConstants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUserAlt, faSearch, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Cart from "../../components/cart/Cart";
import {useQuery, useQueryClient} from "react-query";
import {WWSError} from "../../types/dto/Error";
import {getCategories, getCategory, getItemsOfCategory, searchItems} from "../../services/queries";
import {CategoryResponse} from "../../types/dto/Category";
import {cleanUser} from "../../services/helperFunctions";
import {ItemQueryResultResponse, ItemResponse} from "../../types/dto/InventoryItem";
import ModifyProfile from "../../components/user/ModifyProfile";
import {Typeahead} from "react-bootstrap-typeahead";
import {useNavigationContext} from "../../providers/NavigationContext";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

const CustomerNavbar: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const [searchCategory, setSearchCategory] = useState<CategoryResponse>({id: -1, name: "", technicalSpecifications: []});
  const [searchText, setSearchText] = useState<string>("");
  const [canStartSearch, setCanStartSearch] = useState<boolean>(false);
  const [canUpdate, setCanUpdate] = useState<boolean>(true);
  const [searchOptions, setSearchOptions] = useState<ItemResponse[]>([]);
  const history = useHistory();
  const client = useQueryClient();
  const {
    chosenCategoryId,
    chosenCategory,
    setChosenCategory,
    setChosenCategoryId,
    resetChosenItem,
    resetChosenCategory,
    toggleResetSearch,
    isResetSearch,
    resetAll: resetNavigation,
  } = useNavigationContext();

  const {refetch, isFetched} = useQuery(
    'chosenCategory',
    () => getCategory(chosenCategoryId),
    {
      retry: false,
      onSuccess: async (data) => {
        setChosenCategoryId(data.id);
        setChosenCategory(data);
      },
      //enabled: canUpdate
    });

  const {data: searchResult, refetch: refertchSearch} = useQuery<ItemQueryResultResponse, WWSError>(
    'searchItems',
    () => searchItems({itemName: searchText, categories: searchCategory.id !== -1 ? [searchCategory.id] : []}),
    {
      retry: false,
      onSuccess: async (data) => {
        setSearchOptions(data.items);
      },
      enabled: canStartSearch
    });

  const { isLoading, data: categories } = useQuery<CategoryResponse[], WWSError>(
    'categories',
    getCategories,
    {
      retry: 1
    }
  );

  useEffect(() => {
    if (isFetched && chosenCategoryId !== chosenCategory.id) {
      refetch();
    }
  }, [chosenCategoryId]);

  useEffect(() => {
    if (canStartSearch) {
      refertchSearch();
    }
  }, [searchText]);

  useEffect(() => {
    if (isResetSearch) {
      setSearchCategory({id: -1, name: "", technicalSpecifications: []});
      setSearchText("");
      setSearchOptions([]);
      toggleResetSearch();
    }
  }, [isResetSearch]);


  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="flex-end"  bg="blue.300" />
    );
  }

  const onCategorySelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    if (categories !== undefined) {
      const selected = categories.find(c => c.id === parseInt(idStr, 10));
      if (selected !== undefined) {
        resetChosenItem();
        setChosenCategoryId(selected.id);
        history.push(homeRoute);
      }
    }
  }

  const onSearchCategorySelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    if (categories !== undefined) {
      const selected = categories.find(c => c.id === parseInt(idStr, 10));
      if (selected !== undefined) {
        setSearchCategory({id: selected.id, name: "", technicalSpecifications: []});
      }
    }
  }

  const generateCategoriesList = () => {
    if (categories === undefined) return <></>;
    return (
      <>
        <option key={`cat_null`} value={-1}>Összes kategória</option>
        {categories.map((c: CategoryResponse, i: number) => (
          <option key={`cat_${i}`} value={c.id}>{c.name}</option>
        ))}
      </>
    )
  }

  const logout = () => {
    cleanUser();
    resetNavigation();
    history.push(loginRoute);
  };

  const onSearchInputChanged = async (text: string, event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(text);
    setCanStartSearch(text.length >= 2);
  };

  const onSearchSelectedChanged = async (options: any[]) => {
    const selected = options as ItemResponse[];
    if (selected.length === 1) {
      const text = selected[0].name;
      setSearchText(text);
      setCanStartSearch(true);
      resetChosenCategory();
      resetChosenItem();
      history.push(`${searchRoute}?q=${text}`);
      window.location.reload();
    }
  };

  const onKeyPressed = async (e: KeyboardEvent) => {
    if (canStartSearch && e.key === "Enter") {
      let searchUrl = `q=${searchText}`;
      if (searchCategory.id !== -1) {
        searchUrl += `&cat=${searchCategory.id}`;
      }
      resetChosenCategory();
      resetChosenItem();
      history.push(`${searchRoute}?${searchUrl}`);
      window.location.reload();
    }
  };

  const onSearchButtonClicked = async () => {
    if (canStartSearch) {
      let searchUrl = `q=${searchText}`;
      if (searchCategory.id !== -1) {
        searchUrl += `&cat=${searchCategory.id}`;
      }
      resetChosenCategory();
      resetChosenItem();
      history.push(`${searchRoute}?${searchUrl}`);
      window.location.reload();
    }
  };

  return(
    <Box  bg="blue.300">
      <Flex alignItems="center" justifyContent="flex-end" w="90%" mx="auto" >
        <Flex h="100%" w="300px" alignItems="center" ml="2%" mr="2%">
          <Select
            value={-1}
            borderTopRadius="2xl"
            onChange={onCategorySelectChange}
            bg="white"
          >
            {generateCategoriesList()}
          </Select>
        </Flex>

        <Flex h="100%" w="250px" alignItems="center" ml="2%">
          <Select
            size="lg"
            value={searchCategory.id}
            borderLeftRadius="full"
            borderRightColor="white"
            //focusBorderColor="white"
            _hover={{outlineColor: "white", outline: "none !important", borderWidth: "0px"}}
            _focus={{outlineColor: "white", outline: "none !important", borderWidth: "0px"}}
            onChange={onSearchCategorySelectChange}
            bg="white"
          >
            {generateCategoriesList()}
          </Select>
        </Flex>

        <Flex h="48px" w="40%" alignItems="center" ml="0px" mr="auto">
          <Typeahead
            style={{
              height: "100%",
              width: "80%",
            }}
            minLength={2}
            id="search_typeahead"
            placeholder="Keresés..."
            labelKey={"name"}
            options={searchOptions}

            renderMenuItemChildren={(o: any) => {
              const option = o as ItemResponse;
              return (
                <Fragment>
                  <Box backgroundColor="white" _hover={{backgroundColor: "lightgrey !important"}}>
                    <Text>
                      {option.name}
                    </Text>
                  </Box>
                </Fragment>
              )
            }}
            emptyLabel={
              <Fragment>
                <Text backgroundColor="white">
                  Nincs találat...
                </Text>
              </Fragment>
            }
            positionFixed={true}
            inputProps={{
              style: {
                width: "100%"
              }
            }}

            onInputChange={onSearchInputChanged}
            onChange={onSearchSelectedChanged}
            onKeyDown={onKeyPressed}
            selected={[searchText]}
            multiple={false}
          />
          <Button h="100%" width="20%" borderRightRadius="full" onClick={onSearchButtonClicked}>
            <FontAwesomeIcon
              icon={faSearch as IconProp}
            />
          </Button>
        </Flex>

        <Flex h="100px" w="10%" alignItems="center" ml="3%" >
          <Popover
            isLazy
            trigger="click"
          >
            <PopoverTrigger>

                <Button w="100%" h="100%" colorScheme="blue.300" _hover={{ bg: "blue.500" }} variant="solid">
                  <FontAwesomeIcon
                    icon={faUserAlt as IconProp}
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
                  icon={faShoppingCart as IconProp}
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
                icon={faSignOutAlt as IconProp}
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

export default withRouter(CustomerNavbar);

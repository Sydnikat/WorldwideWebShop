import React, {Fragment, useContext, useEffect, useRef, useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {Box, Button, Flex, Grid, GridItem, Heading, SimpleGrid, Spinner, Text} from "@chakra-ui/react";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import CustomerNavigationStepper from "../../layout/navbar/CustomerNavigationStepper";
import {CategoryResponse} from "../../types/dto/Category";
import {ItemQueryResultResponse, ItemResponse, TechnicalSpecInfoQueryRequest} from "../../types/dto/InventoryItem";
import ItemCard from "../../components/item/ItemCard";
import {useQuery, useQueryClient} from "react-query";
import {WWSError} from "../../types/dto/Error";
import {getCategories, searchItems, searchItemsFromURI} from "../../services/queries";
import NavigationStepperProxy from "../../layout/navbar/NavigationStepperProxy";
import {useNavigationContext} from "../../providers/NavigationContext";
import TechnicalSpecificationList from "../../components/search/technicalSpecification/TechnicalSpecificationList";
import FilterBar from "../../components/search/FilterBar";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import {Sorting} from "../../types/enum/SortingDirection";
import CategorySelection from "../../components/search/CategorySelection";
import {getSortBy, getSortDirection} from "../../services/helperFunctions";

const SearchPage: React.FC<RouteComponentProps> = ({ location }) => {
  const searchQueryStr = location.search;
  const searchParams = searchQueryStr.split("&");
  const searchStr = searchParams.length > 0 ? searchParams[0].substring(3) : "";
  const searchCategoryIdStr = searchParams.length === 2 ? searchParams[1].substring(4) : null;
  const itemListRef = useRef<HTMLDivElement>(null);
  const {chosenCategory, setChosenCategoryId, resetChosenCategory} = useNavigationContext();

  const [foundCategories, setFoundCategories] = useState<CategoryResponse[]>([]);
  const [itemPerRow, setItemPerRow] = useState<number>(Math.floor((itemListRef.current?.clientWidth ?? (window.innerWidth * 0.6)) / 310));
  const [showOnlyStock, setShowOnlyStock] = useState<boolean>(false);
  const [currentPriceRange, setCurrentPriceRange] = useState<number[] | undefined>([]);
  const [sorting, setSorting] = useState<Sorting>(Sorting.UNSORTED);
  const [techSpecRequests, setTechSpecRequests] = useState<TechnicalSpecInfoQueryRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [queryResult, setQueryResult] = useState<ItemQueryResultResponse | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const items_per_page = 5;

  const { isLoading, data: categories } = useQuery<CategoryResponse[], WWSError>(
    'categories',
    getCategories,
    {
      retry: 1,
      onSuccess: (data) => {
        if (searchCategoryIdStr !== null) {
          const id = parseInt(searchCategoryIdStr, 10);
          if (!isNaN(id)) {
            const selected = data.find(c => c.id === id)
            if (selected !== undefined) {
              setSelectedCategory(selected);
            }
          }
        }
      }
    }
  );

  const {data: search} = useQuery<ItemQueryResultResponse, WWSError>(
    'searchPageItems',
    () => searchItemsFromURI(searchQueryStr),
    {
      retry: false,
      onSuccess: async (data) => {
        if (categories !== undefined) {
          const foundCatIds = [... new Set(data.items.map(item => item.categoryId))];
          const foundCategories = categories.filter(cat => foundCatIds.includes(cat.id));
          setFoundCategories(foundCategories);
          setQueryResult(data);
          if (foundCategories.length === 1) {
            setSelectedCategory(foundCategories[0]);
            setChosenCategoryId(foundCategories[0].id);
          }
        }
      },
      enabled: categories !== undefined
    });

  const { data: itemQuery, refetch: refetchItemQuery} = useQuery<ItemQueryResultResponse, WWSError>(
    'itemQuery',
    () => searchItems({
      itemName: searchStr,
      categories: selectedCategory ? [selectedCategory.id] : [],
      hasStock: showOnlyStock,
      priceRange: (currentPriceRange !== undefined && currentPriceRange.length !== 0) ? currentPriceRange : undefined,
      sortBy: getSortBy(sorting),
      sortDirection: getSortDirection(sorting),
      techSpecRequests: techSpecRequests
    }),
    {
      enabled: selectedCategory !== null,
      onSuccess: data => {
        setQueryResult(data)
        setPage(0);
      }
    }
  );

  useEffect(() => {
    refetchItemQuery();
  }, [selectedCategory, sorting, showOnlyStock, currentPriceRange, techSpecRequests]);

  const handleTechSpecSelectChange = (requests: TechnicalSpecInfoQueryRequest[]) => {
    setTechSpecRequests(requests);
    if (requests.length === 0) {
      setCurrentPriceRange([]);
    }
  }

  const handleCategorySelectionCallback = (category: CategoryResponse | undefined) => {
    setSelectedCategory(category ?? null);
    setChosenCategoryId(category?.id ?? -1);
    if (category === undefined) {
      setCurrentPriceRange([]);
      resetChosenCategory();
    }
  }

  const increasePageNumber = () => {
    if (queryResult !== undefined) {
      if (queryResult.items.length > items_per_page * (page + 1)) {
        setPage(page + 1);
      }
    }
  }

  const decreasePageNumber = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  }

  const handleResize = () => {
    if (itemListRef.current !== null) {
      setItemPerRow(Math.floor(itemListRef.current.clientWidth / 310));
    }
  }

  window.addEventListener('resize', handleResize);

  if (queryResult === undefined) {
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
      <Flex>
        <Flex w="25%">
          <Flex
            w="100%"
            direction="column"
            borderWidth="1px"
            borderRadius="lg"
            overflow="inherit"
            boxShadow="lg"
            backgroundColor="white"
            mt="6%"
          >
            <Flex w="100%" h="100px" direction="column">
              <Flex w="100%" h="35%" direction="column">
                <NavigationStepperProxy />
                <Flex w="100%" h="50%" px="5%">
                  <Box my="1%" borderColor="grey.800" borderTopWidth="3px" h="0%" />
                </Flex>
              </Flex>
              <Flex w="100%" h="65%" mt="5%">
                <Flex h="100%" w="100%">
                  <Flex w="65%" h="auto" direction="column">
                    <Text ml="5" color="black" fontSize="15px">
                      Keresési kifejezés:
                    </Text>
                    <Text ml="5" color="black" fontSize="20px">
                      "<b>{searchStr}</b>"
                    </Text>
                  </Flex>
                  <Flex w="35%" h="auto">
                    <Text my="auto" ml="auto" mr="5" color="gray" fontSize="20px">
                      ({queryResult.items.length})
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex w="100%">
              {foundCategories.length === 0 ? null
                :
                <CategorySelection
                  categories={foundCategories}
                  categorySelectedCallback={handleCategorySelectionCallback}
                />
              }
            </Flex>
            <Flex w="100%">
              {selectedCategory !== null && chosenCategory.id !== -1 ?
                <TechnicalSpecificationList
                  items={queryResult.items}
                  categorySpecs={chosenCategory.technicalSpecifications}
                  techSpecChangedCallback={handleTechSpecSelectChange}
                />
                :
                null
              }
            </Flex>
          </Flex>
        </Flex>

        <Flex w="75%">
          <Flex w="100%" direction="column" mt="2%" mx="2%">
            {queryResult.items.length === 0 ? null
              :
              <Flex
                width="100%"
                borderWidth="1px"
                borderRadius="lg"
                overflow="inherit"
                boxShadow="lg"
                backgroundColor="white"
              >
                <FilterBar
                  setShowOnlyStock={setShowOnlyStock}
                  minPrice={queryResult.minPrice}
                  maxPrice={queryResult.maxPrice}
                  setCurrentPriceRange={setCurrentPriceRange}
                  setSorting={setSorting}
                />
              </Flex>
            }
            <Flex
              w="100%"
              ref={itemListRef}
              mt="2%"
            >
              {queryResult.items.length === 0 ?
                <Flex alignItems="center" justifyContent="center" mx="auto" my="20%">
                  <Heading size="lg" color="grey">
                    {techSpecRequests.length === 0 && currentPriceRange?.length === 0 ?
                      "Nincsenek árucikkek ebben a kategóriában..."
                      :
                      "Nem található árucikk a keresési feltételekkel..."
                    }
                  </Heading>
                </Flex>
                :
                <Flex direction="column" width="100%">
                  <Flex width="100%" grow={1}>
                    <SimpleGrid
                      columns={itemPerRow}
                      spacing="20px"
                      my="auto"
                    >
                      {queryResult.items.slice(items_per_page * page, items_per_page * (page + 1)).map((i: ItemResponse, idx: number) => (
                        <Fragment key={`item_${idx}`}>
                          <ItemCard item={i}/>
                        </Fragment>
                      ))}
                    </SimpleGrid>
                  </Flex>

                  <Flex alignItems="center" justifyContent="center" mx="auto" my="auto" mb="0" w="100%" pt="5">

                    <Box as="button" py="1%" w="10%" mr="2" borderRadius="full" _hover={{backgroundColor: "#e9e9e9"}} bg="gray.100">
                      <div onClick={decreasePageNumber}>
                        <ArrowLeftIcon />
                      </div>
                    </Box>
                    <Flex>
                      {page + 1}
                    </Flex>
                    <Box as="button" py="1%" w="10%" ml="2" borderRadius="full" _hover={{backgroundColor: "#e9e9e9"}} bg="gray.100">
                      <div onClick={increasePageNumber}>
                        <ArrowRightIcon />
                      </div>
                    </Box>

                  </Flex>
                </Flex>
              }
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </AuthenticatedLayout>
  );

}

export default SearchPage;

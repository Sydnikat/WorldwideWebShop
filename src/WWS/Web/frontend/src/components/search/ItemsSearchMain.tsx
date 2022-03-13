import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import NavigationStepperProxy from "../../layout/navbar/NavigationStepperProxy";
import {Box, Flex, Heading, SimpleGrid, Spacer, Spinner, Text} from "@chakra-ui/react";
import FilterBar from "./FilterBar";
import TechnicalSpecificationList from "./technicalSpecification/TechnicalSpecificationList";
import {ItemQueryResultResponse, ItemResponse, TechnicalSpecInfoQueryRequest} from "../../types/dto/InventoryItem";
import React, {Fragment, useEffect, useRef, useState} from "react";
import ItemCard from "../item/ItemCard";
import {useQuery} from "react-query";
import {WWSError} from "../../types/dto/Error";
import {searchItems} from "../../services/queries";
import {useNavigationContext} from "../../providers/NavigationContext";
import {Sorting, SortingDirection} from "../../types/enum/SortingDirection";
import {SortingType} from "../../types/enum/SortingType";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import {getSortBy, getSortDirection} from "../../services/helperFunctions";

interface IItemsSearchMainProps {

}

const ItemsSearchMain = (props: IItemsSearchMainProps) => {
  const {chosenCategory, chosenCategoryId} = useNavigationContext();
  const itemListRef = useRef<HTMLDivElement>(null);
  const [itemPerRow, setItemPerRow] = useState<number>(Math.floor((itemListRef.current?.clientWidth ?? (window.innerWidth * 0.6)) / 310));
  const [showOnlyStock, setShowOnlyStock] = useState<boolean>(false);
  const [currentPriceRange, setCurrentPriceRange] = useState<number[] | undefined>([]);
  const [sorting, setSorting] = useState<Sorting>(Sorting.UNSORTED);
  const [techSpecRequests, setTechSpecRequests] = useState<TechnicalSpecInfoQueryRequest[]>([]);
  const [page, setPage] = useState<number>(0);
  const items_per_page = 5;

  const { data: itemQuery, refetch: refetchItemQuery, isRefetching} = useQuery<ItemQueryResultResponse, WWSError>(
    'itemQuery',
    () => searchItems({
      categories: [chosenCategory.id],
      hasStock: showOnlyStock,
      priceRange: (currentPriceRange !== undefined && currentPriceRange.length !== 0) ? currentPriceRange : undefined,
      sortBy: getSortBy(sorting),
      sortDirection: getSortDirection(sorting),
      techSpecRequests: techSpecRequests
    }),
    {
      enabled: chosenCategory.id !== -1,
      onSuccess: data => {
        setPage(0);
      }
    }
  );

  useEffect(() => {
    if (chosenCategory.id !== -1 && chosenCategory.name.length !== 0) {
      refetchItemQuery();
    }
  }, [chosenCategory, sorting, showOnlyStock, currentPriceRange, techSpecRequests]);


  useEffect(() => {
    if (!isRefetching && itemQuery !== undefined && itemQuery.items.length === 0) {
      if (techSpecRequests.length === 0 && currentPriceRange?.length !== 0) {
        setCurrentPriceRange([]);
      }
    }
  }, [isRefetching]);

  const handleResize = () => {
    if (itemListRef.current !== null) {
      setItemPerRow(Math.floor(itemListRef.current.clientWidth / 310));
    }
  }

  const handleTechSpecSelectChange = (requests: TechnicalSpecInfoQueryRequest[]) => {
    setTechSpecRequests(requests);
    if (requests.length === 0) {
      setCurrentPriceRange([]);
    }
  }

  const increasePageNumber = () => {
    if (itemQuery !== undefined) {
      if (itemQuery.items.length > items_per_page * (page + 1)) {
        setPage(page + 1);
      }
    }
  }

  const decreasePageNumber = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  }

  window.addEventListener('resize', handleResize);

  if (itemQuery === undefined) {
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
              <Flex w="100%" h="65%" mt="5%">
                <Text ml="5" color="black" fontSize="30px">
                  <b>{chosenCategory.name}</b>
                </Text>
                <Text ml="auto" mr="5" color="gray" fontSize="30px">
                  ({itemQuery.items.length})
                </Text>
              </Flex>
              <Flex w="100%" h="35%">
                <NavigationStepperProxy />
              </Flex>
            </Flex>
            <Flex w="100%">
              <TechnicalSpecificationList
                items={itemQuery.items}
                categorySpecs={chosenCategory.technicalSpecifications}
                techSpecChangedCallback={handleTechSpecSelectChange}
              />
            </Flex>
          </Flex>
        </Flex>

        <Flex w="75%">
          <Flex w="100%" direction="column" mt="2%" mx="2%">
            {itemQuery.items.length === 0 ? null
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
                  minPrice={itemQuery.minPrice}
                  maxPrice={itemQuery.maxPrice}
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
              {itemQuery.items.length === 0 ?
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
                      {itemQuery.items.slice(items_per_page * page, items_per_page * (page + 1)).map((i: ItemResponse, idx: number) => (
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

export default ItemsSearchMain;

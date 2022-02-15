import {Box, Flex, Select, Spinner} from "@chakra-ui/react";
import React, {Fragment, useEffect, useState} from "react";
import {useQuery} from "react-query";
import {CategoryResponse} from "../../types/dto/Category";
import {WWSError} from "../../types/dto/Error";
import {getCategories, getItemsOfCategory} from "../../services/queries";
import {ItemResponse} from "../../types/dto/InventoryItem";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import InventoryCategoryRow from "./category/InventoryCategoryRow";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import CreateCategoryButton from "./category/CreateCategoryButton";
import {useInventoryContext} from "../../providers/InventoryContext";

interface IInventoryMainProps {
  reload: boolean;
  dispatchReloaded: () => void;
}

const InventoryMain = ({reload, dispatchReloaded}: IInventoryMainProps) => {
  const {selectedCategory, resetSelectedCategory, setSelectedCategory, isReloadCalled, toggleReloadCategories} = useInventoryContext();
  const [page, setPage] = useState<number>(0);
  const items_per_page = 5;

  const { data: categories, isFetched: categoriesFetched, refetch: refetchCategories } = useQuery<CategoryResponse[], WWSError>(
    'categories',
    getCategories,
  );
  const { data: items, refetch: refetchItems } = useQuery<ItemResponse[], WWSError>(
    'items',
    () => getItemsOfCategory({categoryId: selectedCategory.id, number_per_page: items_per_page, page: page}),
    {
      enabled: categoriesFetched && selectedCategory.id !== 0
    }
  );

  useEffect(() => {
    if (isReloadCalled) {
      toggleReloadCategories();
      setPage(0);
      resetSelectedCategory();
      refetchCategories();
      refetchItems();
    }
  }, [isReloadCalled]);


  useEffect(() => {
    if (reload) {
      toggleReloadCategories();
      dispatchReloaded();
    }
  }, [reload]);

  useEffect(() => {
    refetchItems();
  }, [selectedCategory, page]);


  const onCategorySelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    if (categories !== undefined) {
      const selected = categories.find(c => c.id === parseInt(idStr, 10));
      if (selected !== undefined) {
        setPage(0);
        setSelectedCategory(selected);
      }
    }
  }

  const increasePageNumber = () => {
    if (items?.length === items_per_page) {
      setPage(page + 1);
    }
  }

  const decreasePageNumber = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  }

  if (categories === undefined || reload) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </AuthenticatedLayout>
    )
  }

  return(
    <Flex w="100%" alignItems="center">
      <Flex grow={1} direction="column">

        <Flex w="100%" mb="2%">
          <Flex w="75%" alignItems="center">
            <Select
              value={"none"}
              onChange={onCategorySelectChange}
              bg="white"
            >
              <option key={`cat_null`} value={"none"} disabled hidden>Válasszon kategóriát...</option>
              {categories.map((c: CategoryResponse, i: number) => (
                <option key={`cat_${i}`} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Flex>
          <Flex w="25%" alignItems="center" ml="2">
            <CreateCategoryButton />
          </Flex>
        </Flex>

        {selectedCategory.id !== 0 ?
          <Fragment key={`cat_row${selectedCategory.id}`}>
            <InventoryCategoryRow
              category={selectedCategory}
              items={items !== undefined ? items.filter(i => i.categoryId === selectedCategory.id) : []}
            />

            <Flex alignItems="center" justifyContent="center" grow={1} mx="auto" w="70%" h="15%">

              <Box as="button" py="1%" w="10%" mr="2" borderRadius="full" _hover={{backgroundColor: "#e9e9e9"}} bg="#fafafa">
                <div onClick={decreasePageNumber}>
                  <ArrowLeftIcon />
                </div>
              </Box>
              <Flex>
                {page + 1}
              </Flex>
              <Box as="button" py="1%" w="10%" ml="2" borderRadius="full" _hover={{backgroundColor: "#e9e9e9"}} bg="#fafafa">
                <div onClick={increasePageNumber}>
                  <ArrowRightIcon />
                </div>
              </Box>

            </Flex>
          </Fragment>
        : null}
      </Flex>
    </Flex>
  );
}

export default InventoryMain;

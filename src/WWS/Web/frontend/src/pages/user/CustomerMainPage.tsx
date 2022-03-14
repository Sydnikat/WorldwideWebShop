import React, {Fragment, useRef, useState} from "react";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import {Flex, SimpleGrid, Spinner} from "@chakra-ui/react";
import {useQuery} from "react-query";
import {getCategories} from "../../services/queries";
import {WWSError} from "../../types/dto/Error";
import {TechnicalSpecInfoQueryRequest} from "../../types/dto/InventoryItem";
import {useNavigationContext} from "../../providers/NavigationContext";
import {Sorting, SortingDirection} from "../../types/enum/SortingDirection";
import {SortingType} from "../../types/enum/SortingType";
import {CategoryResponse} from "../../types/dto/Category";
import CategoryCard from "../../components/category/CategoryCard";
import ItemsSearchMain from "../../components/search/ItemsSearchMain";



const CustomerMainPage = () => {
  const {chosenCategory} = useNavigationContext();
  const categoryListRef = useRef<HTMLDivElement>(null);
  const [categoryPerRow, setCategoryPerRow] = useState<number>(Math.floor((categoryListRef.current?.clientWidth ?? (window.innerWidth * 0.8)) / 310));

  const { isFetched: categoriesFetched, data: categories } = useQuery<CategoryResponse[], WWSError>('categories', getCategories);

  const handleResize = () => {
    if (categoryListRef.current !== null) {
      setCategoryPerRow(Math.floor(categoryListRef.current.clientWidth / 310));
    }
  }

  window.addEventListener('resize', handleResize);

  if (!categoriesFetched) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </AuthenticatedLayout>
    )
  }

  if (chosenCategory.id === -1 && categoriesFetched && categories !== undefined) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto" ref={categoryListRef}>
          <SimpleGrid
            columns={categoryPerRow}
            spacing="20px"
            m="2%"
          >
            {categories.map((c: CategoryResponse, idx: number) => (
              <Fragment key={`cat_card_${idx}`}>
                <CategoryCard category={c} />
              </Fragment>
            ))}
          </SimpleGrid>
        </Flex>
      </AuthenticatedLayout>
    )
  }

  if (chosenCategory.id !== -1) {
    return(
      <ItemsSearchMain />
    )
  }

  return (<></>)
}

export default CustomerMainPage;

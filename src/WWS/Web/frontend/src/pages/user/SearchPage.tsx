import React, {useContext, useEffect} from "react";
import {RouteComponentProps} from "react-router-dom";
import {Box, Button, Flex, Grid, GridItem, Heading, Spinner, Text} from "@chakra-ui/react";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import CustomerNavigationStepper from "../../layout/navbar/CustomerNavigationStepper";
import {CategoryResponse} from "../../types/dto/Category";
import {ItemResponse} from "../../types/dto/InventoryItem";
import ItemCard from "../../components/item/ItemCard";
import {useQuery, useQueryClient} from "react-query";
import {WWSError} from "../../types/dto/Error";
import {searchItems, searchItemsFromURI} from "../../services/queries";
import NavigationStepperProxy from "../../layout/navbar/NavigationStepperProxy";

const SearchPage: React.FC<RouteComponentProps> = ({ location }) => {
  const searchStr = location.search;
  const client = useQueryClient();

  const {data: items, refetch} = useQuery<ItemResponse[], WWSError>(
    'searchItems',
    () => searchItemsFromURI(searchStr),
    {
      retry: false,
      onSuccess: async (data) => {
        client.setQueryData<ItemResponse[]>("items", data);
      }
    });

  useEffect(() => {
    refetch();
  }, [searchStr]);


  if (items === undefined) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </AuthenticatedLayout>
    )
  }

  if (items.length === 0) {
    return(
      <AuthenticatedLayout>
        <NavigationStepperProxy />
        <Flex alignItems="center" justifyContent="center" mx="auto" my="20%">
          <Heading size="lg" color="grey">
            Nem található termék ilyen keresési feltételekkel...
          </Heading>
        </Flex>
      </AuthenticatedLayout>
    )
  }

  return(
    <AuthenticatedLayout>
      <NavigationStepperProxy />
      <Box>
        <Grid
          templateColumns="repeat(6, 1fr)"
          gap="1em"
        >
          {items.map((i: ItemResponse, idx: number) => (
            <GridItem key={`item_${idx}`}>
              <ItemCard item={i} />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </AuthenticatedLayout>
  );

}

export default SearchPage;

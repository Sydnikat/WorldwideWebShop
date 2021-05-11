import React, {useEffect, useState} from "react";
import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import {Badge, Box, Flex, Grid, GridItem, Heading, Spinner, Text} from "@chakra-ui/react";
import ItemCard from "../components/ItemCard";
import {useQuery, useQueryClient} from "react-query";
import {axiosInstance} from "../services/config/axios";
import {getCategory, getItemsOfCategory} from "../services/queries";
import {WWSError} from "../types/Error";
import {ItemResponse} from "../types/InventoryItem";
import {CategoryResponse} from "../types/Category";

const CustomerMainPage = () => {
  const client = useQueryClient();

  const { isLoading, error, data } = useQuery<ItemResponse[], WWSError>(
    'items',
    () => getItemsOfCategory(client.getQueryData<CategoryResponse>("chosenCategory")?.id ?? -1),
  );

  if (data === undefined) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </AuthenticatedLayout>
    )
  }

  if (data.length === 0) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto" my="20%">
          <Heading size="lg" color="grey">
            Nincsenek árucikkek ebben a kategóriában...
          </Heading>
        </Flex>
      </AuthenticatedLayout>
    )
  }

  return(
      <AuthenticatedLayout>
        <Box>
          <Grid
            p="1em"
            templateColumns="repeat(6, 1fr)"
            gap="1em"
          >
            {data.map((i: ItemResponse, idx: number) => (
              <GridItem key={`item_${idx}`}>
                <ItemCard item={i} />
              </GridItem>
            ))}
          </Grid>
        </Box>
      </AuthenticatedLayout>
  );
}

export default CustomerMainPage;

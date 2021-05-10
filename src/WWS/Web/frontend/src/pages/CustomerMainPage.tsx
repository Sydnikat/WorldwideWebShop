import React  from "react";
import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import {Badge, Box, Flex, Grid, GridItem, Spinner} from "@chakra-ui/react";
import ItemCard from "../components/ItemCard";
import {useQuery, useQueryClient} from "react-query";
import {fetchGit, Git} from "./UserProfilePage";
import {axiosInstance} from "../services/config/axios";
import {getItemsOfCategory} from "../services/queries";
import {WWSError} from "../types/Error";
import {ItemResponse} from "../types/InventoryItem";

const CustomerMainPage = () => {
  const { isLoading, error, data } = useQuery<ItemResponse[], WWSError>('items', () => getItemsOfCategory(1), {retry: 1});

  if (data === undefined) {
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
        <Box>
          <Grid
            p="1em"
            border="1px" borderColor="red"
            templateColumns="repeat(5, 1fr)"
            gap="1em"
          >
            {Array(12)
              .fill("")
              .map((_, i) => (
                <GridItem key={i}>
                  <ItemCard item={null} />
                </GridItem>
              ))}
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

import React, {useEffect, useState} from "react";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import {Badge, Box, Flex, Grid, GridItem, Heading, Spinner, Text} from "@chakra-ui/react";
import ItemCard from "../../components/item/ItemCard";
import {useQuery, useQueryClient} from "react-query";
import {axiosInstance} from "../../services/config/axios";
import {getCategory, getItemsOfCategory} from "../../services/queries";
import {WWSError} from "../../types/dto/Error";
import {ItemResponse} from "../../types/dto/InventoryItem";
import {CategoryResponse} from "../../types/dto/Category";
import CustomerNavigationStepper from "../../layout/navbar/CustomerNavigationStepper";
import {useNavigationContext} from "../../providers/NavigationContext";
import NavigationStepperProxy from "../../layout/navbar/NavigationStepperProxy";

const CustomerMainPage = () => {
  const {chosenCategory} = useNavigationContext();

  const { data } = useQuery<ItemResponse[], WWSError>(
    'items',
    () => getItemsOfCategory({categoryId: chosenCategory.id}),
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
        <NavigationStepperProxy />
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
        <NavigationStepperProxy />
        <Box>
          <Grid
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

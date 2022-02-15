import React from "react";
import {Fragment} from "react";
import {CategoryResponse} from "../../../types/dto/Category";
import {ItemResponse} from "../../../types/dto/InventoryItem";
import {Box, Divider, Flex, Heading, Spinner, Text} from "@chakra-ui/react";
import InventoryItemRow from "../Item/InventoryItemRow";
import DeleteCategoryButton from "./DeleteCategoryButton";
import CreateItemButton from "../Item/CreateItemButton";

interface IInventoryCategoryRowProps {
  category: CategoryResponse;
  items: ItemResponse[];
}

const InventoryCategoryRow = ({category, items}: IInventoryCategoryRowProps) => {
  return(
    <Fragment>
      <Box mx="auto" w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" boxShadow="sm" pb="4">
        <Flex w="auto" h="50px" alignItems="center">
          <Flex width="85%" h="100%" alignItems="center">
            <Flex width="55%" h="100%" alignItems="center" ml="2%">
              <Text>
                <b>{category.name}</b>
              </Text>
            </Flex>
            <Flex alignItems="center" w="15%" flexDirection="row-reverse">
              <Text>
                <b>Készlet</b>
              </Text>
            </Flex>
            <Flex alignItems="center" w="15%" flexDirection="row-reverse">
              <Text>
                <b>Jelenlegi ár</b>
              </Text>
            </Flex>
            <Flex alignItems="center" w="15%" flexDirection="row-reverse">
              <Text>
                <b>Eredeti ár</b>
              </Text>
            </Flex>
          </Flex>
          <Flex width="15%" h="100%" alignItems="center">
            <Flex py="1" w="35%" mr="2" ml="auto">
              <CreateItemButton category={category} />
            </Flex>
            <Flex py="1" w="35%" mr="2">
              <DeleteCategoryButton category={category} />
            </Flex>
          </Flex>
        </Flex>

        <Divider />

        <Flex grow={1} direction="column">
          {items.map(i =>
            <Fragment key={`item_row${i.id}`}>
              <InventoryItemRow item={i} />
            </Fragment>
          )}
          {items.length === 0 ?
            <Flex alignItems="center" justifyContent="center" mx="auto" mt="4">
              <Text size="lg" color="grey">
                Nincsenek árucikkek ebben a kategóriában...
              </Text>
            </Flex>
          : null}
        </Flex>
      </Box>
    </Fragment>
  );
}

export default InventoryCategoryRow;


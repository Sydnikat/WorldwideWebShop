import React from "react";
import {Fragment} from "react";
import {ItemResponse} from "../../../types/dto/InventoryItem";
import {Box, Flex, Text} from "@chakra-ui/react";
import {DeleteIcon, EditIcon, WarningTwoIcon} from "@chakra-ui/icons";
import DeleteItemButton from "./DeleteItemButton";
import EditItemButton from "./EditItemButton";
import {useHistory} from "react-router-dom";
import {inspectRoute} from "../../../constants/routeConstants";
import {CategoryResponse} from "../../../types/dto/Category";

interface IInventoryItemRowProps {
  item: ItemResponse;
}

const InventoryItemRow = ({item}: IInventoryItemRowProps) => {
  const history = useHistory();

  const onItemRowClick = () => {
    history.push(`${inspectRoute}/${item.id}`)
  };

  return(
    <Fragment>
      <Flex w="auto" h="50px" alignItems="center" p="0" _hover={{backgroundColor: "#fafafa"}}>

        <Flex ml="5%" mr="2%" width="85%" p="0" h="100%" alignItems="center">
          <EditItemButton item={item} />
        </Flex>

        <Flex width="15%" h="100%" alignItems="center">
          <Box
            w="35%"
            mr="2"
            ml="auto"
            as="button"
            _hover={{backgroundColor: "#e9e9e9"}}
            borderRadius="full"
            bg="white"
          >
            <div onClick={onItemRowClick}>
              <EditIcon />
            </div>
          </Box>
          <Flex
            py="1"
            w="35%"
            mr="2"
          >
            <DeleteItemButton item={item} />
          </Flex>
        </Flex>
      </Flex>
    </Fragment>
  );
}

export default InventoryItemRow;

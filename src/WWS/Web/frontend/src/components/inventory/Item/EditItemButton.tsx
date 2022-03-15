import {EditIcon, WarningTwoIcon} from "@chakra-ui/icons";
import {Box, Flex, Text, useDisclosure, useToast} from "@chakra-ui/react";
import React, {Fragment} from "react";
import {useMutation, useQueryClient} from "react-query";
import {updateItem, UpdateItemBody} from "../../../services/queries";
import {AxiosError} from "axios";
import {WWSError} from "../../../types/dto/Error";
import {ItemResponse, UpdateItemRequest} from "../../../types/dto/InventoryItem";
import EditItemModal from "./EditItemModal";

interface IEditItemButtonProps {
  item: ItemResponse;
}

const EditItemButton = ({item}: IEditItemButtonProps) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();
  const client = useQueryClient();

  const {mutateAsync: updateItemData, isLoading} = useMutation(updateItem, {
    onError: (error: AxiosError<WWSError>) => {
      const err = error.response!!.data as WWSError;
      if (err.statusCode === 401 || err.statusCode === 400 || err.statusCode === 403) {
        let errorText = "Hiba a mentés során...";
        if (err.message !== undefined) {
          errorText = err.message;
        }
        toast({
          title: `${errorText}`,
          position: "top-right",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    onSuccess: async (item: ItemResponse) => {
      toast({
        title: `Termék frissítve`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      await client.invalidateQueries("items");
    },
    onSettled: (data, error) => {
      onClose();
    }
  });

  const onSaveUpdateItem = async (request: UpdateItemRequest) => {
    const body: UpdateItemBody = {itemId: item.id, request: request}
    await updateItemData(body);
  }

  const onModalOpen = () => onOpen();
  return(
    <Fragment>
      <Flex h="100%" alignItems="center" w="100%" style={{cursor: "pointer"}} onClick={onModalOpen}>
        <Flex alignItems="center" width="55%">
          <Text>
            {item.name}
          </Text>
        </Flex>
        <Flex alignItems="center" w="15%" flexDirection="row-reverse">
          <Text>
            {item.lowLevel >= item.stock ?
              <WarningTwoIcon boxSize={4} color="orange" />
              : null
            }&nbsp;{item.stock}&nbsp;db
          </Text>
        </Flex>
        <Flex alignItems="center" w="15%" flexDirection="row-reverse">
          <Text>
            {item.price}Ft
          </Text>
        </Flex>
        <Flex alignItems="center" w="15%" flexDirection="row-reverse">
          <Text>
            {item.originalPrice}Ft
          </Text>
        </Flex>
      </Flex>

      {isOpen && !isLoading ?
        <EditItemModal
          isOpen={isOpen}
          onClose={onClose}
          inTransaction={isLoading}
          onSaveCallback={onSaveUpdateItem}
          item={item}
          categoryId={item.categoryId}
        />
        : null}
    </Fragment>
  );
}

export default EditItemButton;

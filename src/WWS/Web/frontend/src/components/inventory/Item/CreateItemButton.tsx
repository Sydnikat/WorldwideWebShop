import {AddIcon} from "@chakra-ui/icons";
import {Box, useDisclosure, useToast} from "@chakra-ui/react";
import React, {Fragment} from "react";
import {useMutation, useQueryClient} from "react-query";
import {createItem, PostItemBody} from "../../../services/queries";
import {AxiosError} from "axios";
import {WWSError} from "../../../types/dto/Error";
import {CategoryResponse} from "../../../types/dto/Category";
import {ItemResponse, NewItemRequest} from "../../../types/dto/InventoryItem";
import NewItemModal from "./NewItemModal";

interface ICreateItemButtonProps {
  category: CategoryResponse;
}

const CreateItemButton = ({category}: ICreateItemButtonProps) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();
  const client = useQueryClient();

  const {mutateAsync: addItem, isLoading} = useMutation(createItem, {
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
        title: `Termék létrehozva`,
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

  const onSaveNewItem = async (request: NewItemRequest) => {
    const body: PostItemBody = {categoryId: category.id, request: request}
    await addItem(body);
  }

  const onModalOpen = () => onOpen();
  return(
    <Fragment>
      <Box
        as="button"
        _hover={{backgroundColor: "#e9e9e9"}}
        w="100%"
        borderRadius="full"
        bg="white"
        ml="auto"
      >
        <div onClick={onModalOpen}>
          <AddIcon />
        </div>
      </Box>

      {isOpen && !isLoading ?
        <NewItemModal
          isOpen={isOpen}
          onClose={onClose}
          inTransaction={isLoading}
          onSaveCallback={onSaveNewItem}
        />
        : null}
    </Fragment>
  );
}

export default CreateItemButton;

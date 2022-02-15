import {CategoryResponse} from "../../../types/dto/Category";
import {Box, Spinner, useToast} from "@chakra-ui/react";
import {useMutation, useQueryClient} from "react-query";
import {deleteCategory, deleteItem} from "../../../services/queries";
import {AxiosError, AxiosResponse} from "axios";
import {WWSError} from "../../../types/dto/Error";
import {DeleteIcon} from "@chakra-ui/icons";
import React from "react";
import {ItemResponse} from "../../../types/dto/InventoryItem";

interface IDeleteItemButtonProps {
  item: ItemResponse;
}

const DeleteItemButton = ({item}: IDeleteItemButtonProps) => {
  const toast = useToast();
  const client = useQueryClient();

  const {mutateAsync: deleteInventoryItem, isLoading: deleteLoading} = useMutation(deleteItem, {
    onError: (error: AxiosError<WWSError>) => {
      const err = error.response!!.data as WWSError;
      if (err.statusCode === 401 || err.statusCode === 400 || err.statusCode === 403) {
        let errorText = "Hiba a törlés során...";
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
    onSuccess: async (r: AxiosResponse) => {
      toast({
        title: `Termék törölve`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      await client.invalidateQueries("items");
    }
  });

  const onDeleteButtonClick = async () => {
    if (!deleteLoading) {
      await deleteInventoryItem(item.id);
    }
  };

  return(
    <Box
      as="button"
      _hover={{backgroundColor: "#e9e9e9"}}
      w="100%"
      borderRadius="full"
      bg="white"
    >
      <div onClick={onDeleteButtonClick}>
        {deleteLoading ? <Spinner /> : <DeleteIcon /> }
      </div>
    </Box>
  );
}

export default DeleteItemButton;

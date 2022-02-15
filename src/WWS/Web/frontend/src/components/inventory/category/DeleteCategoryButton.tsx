import {Box, Spinner, useToast} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import React from "react";
import {useMutation} from "react-query";
import {deleteCategory} from "../../../services/queries";
import {AxiosError, AxiosResponse} from "axios";
import {WWSError} from "../../../types/dto/Error";
import {CategoryResponse} from "../../../types/dto/Category";
import {useInventoryContext} from "../../../providers/InventoryContext";

interface IDeleteCategoryButtonProps {
  category: CategoryResponse;
}

const DeleteCategoryButton = ({category}: IDeleteCategoryButtonProps) => {
  const toast = useToast();
  const {toggleReloadCategories} = useInventoryContext();

  const {mutateAsync: deleteCat, isLoading: deleteLoading} = useMutation(deleteCategory, {
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
    onSuccess: (r: AxiosResponse) => {
      toast({
        title: `Kategória törölve`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      toggleReloadCategories();
    }
  });

  const onDeleteButtonClick = async () => {
    if (!deleteLoading) {
      await deleteCat(category.id);
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

export default DeleteCategoryButton;

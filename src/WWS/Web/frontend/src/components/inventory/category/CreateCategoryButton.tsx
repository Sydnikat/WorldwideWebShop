import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import {useMutation} from "react-query";
import {createCategory} from "../../../services/queries";
import {AxiosError} from "axios";
import {WWSError} from "../../../types/dto/Error";
import {
  Box,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import NewCategoryModal from "./NewCategoryModal";
import {CategoryResponse, NewCategoryRequest} from "../../../types/dto/Category";
import {useInventoryContext} from "../../../providers/InventoryContext";

const CreateCategoryButton = () => {
  const {isOpen: isCreateCategoryModalOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();
  const {toggleReloadCategories} = useInventoryContext();

  const {mutateAsync: addCategory, isLoading} = useMutation(createCategory, {
    onError: (error: AxiosError<WWSError>) => {
      const response = error.response;
      const status = response?.status;
      if (status === 401 || status === 400) {
        let errorText = "Hiba a mentés során...";
        if (response !== undefined && response.data !== undefined && response.data.message !== undefined) {
          errorText = response.data.message
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
    onSuccess: (c: CategoryResponse) => {
      toast({
        title: `Kategória létrehozva`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      toggleReloadCategories();
    },
    onSettled: (data, error) => {
      onClose();
    }
  });

  const onSaveNewCategory = async (request: NewCategoryRequest) => {
    await addCategory(request);
  }

  const onModalOpen = () => onOpen();

  return(
    <Fragment>
      <Box
        as="button"
        h="100%"
        w="100%"
        borderRadius="full"
        _hover={{backgroundColor: "#e9e9e9"}}
        bg="white"
        ml="auto"
        borderWidth="1px"
      >
        <div onClick={onModalOpen}>
          Új kategória
        </div>
      </Box>

      {isCreateCategoryModalOpen && !isLoading ?
        <NewCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={onClose}
          inTransaction={isLoading}
          onSaveCallback={onSaveNewCategory}
        />
      : null}
    </Fragment>
  );
}

export default CreateCategoryButton;

import {EditIcon} from "@chakra-ui/icons";
import {Box, useDisclosure, useToast} from "@chakra-ui/react";
import React, {Fragment} from "react";
import {useMutation, useQueryClient} from "react-query";
import {
  updateTechnicalSpecifications,
  UpdateTechSpecsBody
} from "../../../services/queries";
import {AxiosError} from "axios";
import {WWSError} from "../../../types/dto/Error";
import {CategoryResponse, TechnicalSpecificationUpdateRequest} from "../../../types/dto/Category";
import EditCategoryModal from "./EditCategoryModal";

interface IEditCategoryButtonProps {
  category: CategoryResponse;
}

const EditCategoryButton = ({category}: IEditCategoryButtonProps) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();
  const client = useQueryClient();

  const {mutateAsync: changeTechSpecs, isLoading} = useMutation(updateTechnicalSpecifications, {
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
    onSuccess: async (cat: CategoryResponse) => {
      toast({
        title: `Kategória frissítve`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      await client.invalidateQueries("categories");
    },
    onSettled: (data, error) => {
      onClose();
    }
  });

  const onSaveUpdateItem = async (requests: TechnicalSpecificationUpdateRequest[]) => {
    const body: UpdateTechSpecsBody = {categoryId: category.id, requests: requests}
    await changeTechSpecs(body);
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
          <EditIcon />
        </div>
      </Box>

      {isOpen && !isLoading ?
        <EditCategoryModal
          isOpen={isOpen}
          onClose={onClose}
          inTransaction={isLoading}
          onSaveCallback={onSaveUpdateItem}
          categoryId={category.id}
        />
        : null}
    </Fragment>
  );
}

export default EditCategoryButton;

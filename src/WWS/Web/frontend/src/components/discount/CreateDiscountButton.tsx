import {AddIcon} from "@chakra-ui/icons";
import {Box, useDisclosure, useToast} from "@chakra-ui/react";
import React, {Fragment} from "react";
import {useMutation, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {createDiscount} from "../../services/queries";
import {WWSError} from "../../types/dto/Error";
import {DiscountResponse, NewDiscountRequest} from "../../types/dto/Discount";
import NewDiscountModal from "./NewDiscountModal";

interface ICreateDiscountButtonProps {

}

const CreateDiscountButton = ({}: ICreateDiscountButtonProps) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();
  const client = useQueryClient();

  const {mutateAsync: addDiscount, isLoading} = useMutation(createDiscount, {
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
    onSuccess: async (d: DiscountResponse) => {
      toast({
        title: `Akció létrehozva`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      await client.invalidateQueries("discounts");
    },
    onSettled: (data, error) => {
      onClose();
    }
  });

  const onSaveNewDiscount = async (request: NewDiscountRequest) => {
    await addDiscount(request);
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
        <NewDiscountModal
          isOpen={isOpen}
          onClose={onClose}
          inTransaction={isLoading}
          onSaveCallback={onSaveNewDiscount}
        />
        : null}
    </Fragment>
  );
}

export default CreateDiscountButton;

import {Box, Spinner, useToast} from "@chakra-ui/react";
import {useMutation, useQueryClient} from "react-query";
import {AxiosError, AxiosResponse} from "axios";
import {DeleteIcon} from "@chakra-ui/icons";
import React from "react";
import {DiscountResponse} from "../../types/dto/Discount";
import {deleteDiscount} from "../../services/queries";
import {WWSError} from "../../types/dto/Error";

interface IDeleteDiscountButtonProps {
  discount: DiscountResponse;
}

const DeleteDiscountButton = ({discount}: IDeleteDiscountButtonProps) => {
  const toast = useToast();
  const client = useQueryClient();

  const {mutateAsync, isLoading: deleteLoading} = useMutation(deleteDiscount, {
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
        title: `Akció törölve`,
        position: "top-right",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      await client.invalidateQueries("discounts");
    }
  });

  const onDeleteButtonClick = async () => {
    if (!deleteLoading) {
      await mutateAsync(discount.id);
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

export default DeleteDiscountButton;

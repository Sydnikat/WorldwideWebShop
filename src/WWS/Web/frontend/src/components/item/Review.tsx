import {Box, Button, Flex, Text, useToast} from "@chakra-ui/react";
import React from "react";
import {ReviewResponse} from "../../types/Review";
import {CloseIcon, StarIcon} from "@chakra-ui/icons";
import {QueryObserverBaseResult, QueryObserverResult, RefetchOptions, useMutation, useQueryClient} from "react-query";
import {deleteMyReview, postReview} from "../../services/queries";
import {AxiosError, AxiosResponse} from "axios";
import {WWSError} from "../../types/Error";

interface ReviewProps {
  review: ReviewResponse
}

const Review = (props: ReviewProps) => {
  const {review} = props
  const client = useQueryClient();
  const toast = useToast();

  const {mutateAsync, isLoading} = useMutation(deleteMyReview, {
    onError: (error: AxiosError<WWSError>) => {
      const response = error.response;
      const status = response?.status;
      if (status === 401 || status === 400 || status === 403) {
        let errorText = "Hiba a törlés során...";
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
    onSuccess: async (r: AxiosResponse) => {
      await client.invalidateQueries(["reviews", review.itemId]);
    }
  });

  const deleteReview = async () => {
    await mutateAsync(review.id);
  }

  return(
    <Flex
      w="100%"
      grow={1}
      direction="column"
      alignItems="center" justifyContent="space-evenly"
      backgroundColor="white"
      borderWidth="1px"
      borderRadius="md"
      p="2"
      mb="1"
    >
      <Flex w="100%" alignItems="start" justifyContent="space-evenly" mt="1">
        <Box w="30%" textAlign="start">
          {review.reviewerName} ({review.created})
        </Box>
        <Flex w="65%" alignItems="start" mt="1">
          <Flex alignItems="center" justifyContent="center">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < review.rating ? "teal.500" : "gray.300"}
                />
              ))}
          </Flex>
        </Flex>
        <Box w="10%" mr="1">
          <Button
            w="70%"
            borderRadius="full"
            colorScheme="red"
            variant="solid"
            disabled={isLoading}
            onClick={deleteReview}
          >
            <CloseIcon />
          </Button>
        </Box>
      </Flex>
      <Flex w="95%" mx="auto" mt="2">
        <Text>
          {review.summary}
        </Text>
      </Flex>
    </Flex>
  );
}

export default Review;

import {Box, Button, Flex, Textarea, useToast} from "@chakra-ui/react";
import {StarIcon} from "@chakra-ui/icons";
import React, {useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import {postReview, PostReviewBody, updateMyCart} from "../../services/queries";
import {AxiosError} from "axios";
import {WWSError} from "../../types/Error";
import {NewReviewRequest, ReviewResponse} from "../../types/Review";
import {getUser} from "../../services/helperFunctions";

interface NewReviewFormProps {
  itemId: number;
}

const NewReviewForm = (props: NewReviewFormProps) => {
  const {itemId} = props;
  const client = useQueryClient();
  const [myRating, setMyRating] = useState<number>(0);
  const [summary, setSummary] = useState<string>("");
  const toast = useToast();

  const {mutateAsync: addReview, isLoading} = useMutation(postReview, {
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
    onSuccess: async (r: ReviewResponse) => {
      client.setQueryData<ReviewResponse[]>(["reviews", itemId], (prev) => {
        if (prev === undefined) {
          return [r];
        }
        return [...prev, r]
      })
    },
    onSettled: (data, error) => {
      setSummary("")
      setMyRating(0)
    }
  });

  const onSummaryChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSummary(event.target.value);
  }

  const createReview = async () => {
    const user = getUser();
    if (user === null)
      return;

    if (myRating < 1)
      return;

    const request: NewReviewRequest = {
      reviewerName: user.userFullName,
      reviewerId: user.id,
      summary: summary,
      rating: myRating
    }

    const body: PostReviewBody = {
      itemId, request
    };

    await addReview(body);
  }

  return (
    <Flex
      w="90%"
      grow={1}
      direction="column"
      alignItems="center" justifyContent="space-evenly"
      backgroundColor="white"
      borderWidth="1px"
      borderRadius="md"
      p="2"
    >
      <Box w="100%" textAlign="center" my="3">
        <Box textAlign="center">
          <Box as="span" fontSize="xl" fontWeight="semibold">
            A termékkel kapcsolatos tapasztalatok
          </Box>
        </Box>
      </Box>

      <Box w="100%" textAlign="center" my="3">
        <Box w="90%" mx="auto" textAlign="center">
          <Textarea
            value={summary}
            borderColor="black"
            borderWidth="1px"
            borderRadius="md"
            placeholder="Értékelje az árucikket..."
            onChange={onSummaryChange}
          />
        </Box>
      </Box>

      <Box w="100%" textAlign="center" my="3">
        <Flex w="100%" justifyContent="space-evenly">
          <Box>
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon
                  onMouseOver={() => {setMyRating(i+1)}}
                  key={i}
                  fontSize="2xl"
                  mx="1"
                  color={i < myRating ? "blue.500" : "gray.300"}
                />
              ))}
          </Box>
        </Flex>
      </Box>

      <Box w="100%" textAlign="center" my="3">
        <Flex alignItems="center" justifyContent="center" grow={1} mx="auto" w="40%">
          <Button
            w="70%"
            borderRadius="full"
            colorScheme="red"
            variant="solid"
            disabled={isLoading || myRating < 1 || summary === ""}
            onClick={createReview}
          >
            Beküldés
          </Button>
        </Flex>
      </Box>



    </Flex>
  );
}

export default NewReviewForm;

import {Box, Flex, Heading, Spinner} from "@chakra-ui/react";
import ReviewSummary from "./ReviewSummary";
import NewReviewForm from "./NewReviewForm";
import Review from "./Review";
import React, { Fragment } from "react";
import {useQuery} from "react-query";
import {ReviewResponse} from "../../types/dto/Review";
import {WWSError} from "../../types/dto/Error";
import {getItemReviews} from "../../services/queries";

interface ReviewListProps {
  itemId: number;
}

const ReviewList = (props: ReviewListProps) => {
  const {itemId} = props;
  const { data: reviews, refetch } = useQuery<ReviewResponse[], WWSError>(
    ['reviews', itemId],
    () => getItemReviews(itemId), {retry: 1}
    );

  if (reviews === undefined) {
    return(
      <Flex alignItems="center" justifyContent="center" mx="auto">
        <Spinner size="xl" />
      </Flex>
    )
  }

  return(
    <Flex w="100%" direction="column">

      <Box w="100%" textAlign="center" mb="5%">
        <Heading>
          Értékelések
        </Heading>
      </Box>

      <Flex w="100%" h="20%" alignItems="start" justifyContent="start">
        <ReviewSummary reviews={reviews} />
      </Flex>

      <Flex w="100%" h="20%" textAlign="center" my="2%" >
        <NewReviewForm
          itemId={itemId}
        />
      </Flex>

      <Flex w="80%" h="20%" mx="auto" alignItems="start" justifyContent="start">
        <Box w="100%">
          {reviews.map((r: ReviewResponse, i: number) => (
            <Fragment key={`review_${i}`}>
              <Review review={r} />
            </Fragment>
          ))}
        </Box>
      </Flex>

    </Flex>
  );
}

export default ReviewList;

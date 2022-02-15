import {Box, Flex, Progress} from "@chakra-ui/react";
import {StarIcon} from "@chakra-ui/icons";
import React from "react";
import {ReviewResponse} from "../../types/dto/Review";

interface ReviewSummaryProps {
  reviews: ReviewResponse[]
}

const ReviewSummary = (props: ReviewSummaryProps) => {
  const {reviews} = props;
  const count = reviews.length;
  const five = reviews.filter(r => r.rating === 5).length;
  const four = reviews.filter(r => r.rating === 4).length;
  const three = reviews.filter(r => r.rating === 3).length;
  const two = reviews.filter(r => r.rating === 2).length;
  const one = reviews.filter(r => r.rating === 1).length;

  let sum = 0;
  reviews.forEach((r: ReviewResponse) => {
    sum += r.rating;
  })
  const average = sum / count;

  const calculateLength = (r: number): number => {
    if (r === 0)
      return 0;

    return (r / count) * 100
  }

  return(
    <>
      <Box w="50%" h="20%" justifyContent="start" flexGrow={1}>
        <Flex w="80%" mx="auto" direction="column" justifyContent="center">
          <Box textAlign="center" mb="5%">
            <Box as="span" fontSize="xl" fontWeight="semibold">
              A termék általános értékelése
            </Box>
          </Box>
          <Flex w="100%" justifyContent="space-evenly">
            <Box>
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    fontSize="4xl"
                    mx="1"
                    color={i < average ? "blue.500" : "gray.300"}
                  />
                ))}
            </Box>
          </Flex>
          <Box textAlign="center" my="5%">
            <Box as="span" fontSize="lg" fontWeight="normal">
              {count} értékelés
            </Box>
          </Box>
        </Flex>
      </Box>

      <Box w="50%" >
        <Box w="80%" alignItems="center">
          <Flex alignItems="center" justifyContent="center" mb="5">
            <Box mr="2">
              5 csillag
            </Box>
            <Box w="80%">
              <Progress  borderRadius="full" value={calculateLength(five)} />
            </Box>
            <Box ml="4">
              {five}
            </Box>
          </Flex>
          <Flex alignItems="center" justifyContent="center" mb="5">
            <Box mr="2">
              4 csillag
            </Box>
            <Box w="80%">
              <Progress  borderRadius="full" value={calculateLength(four)} />
            </Box>
            <Box ml="4">
              {four}
            </Box>
          </Flex>
          <Flex alignItems="center" justifyContent="center" mb="5">
            <Box mr="2">
              3 csillag
            </Box>
            <Box w="80%">
              <Progress  borderRadius="full" value={calculateLength(three)} />
            </Box>
            <Box ml="4">
              {three}
            </Box>
          </Flex>
          <Flex alignItems="center" justifyContent="center" mb="5">
            <Box mr="2">
              2 csillag
            </Box>
            <Box w="80%">
              <Progress  borderRadius="full" value={calculateLength(two)} />
            </Box>
            <Box ml="4">
              {two}
            </Box>
          </Flex>
          <Flex alignItems="center" justifyContent="center" mb="5">
            <Box mr="2">
              1 csillag
            </Box>
            <Box w="80%">
              <Progress  borderRadius="full" value={calculateLength(one)} />
            </Box>
            <Box ml="4">
              {one}
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default ReviewSummary;

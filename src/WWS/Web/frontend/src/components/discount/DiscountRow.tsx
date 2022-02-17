import {Box, Flex, Text} from "@chakra-ui/react";
import React from "react";
import {DiscountResponse} from "../../types/dto/Discount";
import DeleteDiscountButton from "./DeleteDiscountButton";
import {CategoryResponse} from "../../types/dto/Category";

interface IDiscountRowProps {
  discount: DiscountResponse;
  category?: CategoryResponse;
}

const DiscountRow = ({discount, category}: IDiscountRowProps) => {
  return(
    <Box mx="auto" w="100%" _hover={{backgroundColor: "#fafafa"}} overflow="hidden" bg="white" boxShadow="sm">
      <Flex w="auto" h="50px" alignItems="center">
        <Flex width="85%" h="100%" alignItems="center" mr="2%">
          <Flex width="25%" h="100%" alignItems="center" ml="2%" >
            <Text>
              {category !== undefined ? category.name : discount.id}
            </Text>
          </Flex>
          <Flex alignItems="center" w="25%" flexDirection="row-reverse">
            <Text>
              {discount.startDate}
            </Text>
          </Flex>
          <Flex alignItems="center" w="25%" flexDirection="row-reverse">
            <Text>
              {discount.endDate}
            </Text>
          </Flex>
          <Flex alignItems="center" w="25%" flexDirection="row-reverse">
            <Text>
              {discount.value}%
            </Text>
          </Flex>
        </Flex>
        <Flex width="15%" h="100%" alignItems="center">
          <Flex py="1" w="35%" mr="2" ml="auto">
            <DeleteDiscountButton discount={discount} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default DiscountRow;

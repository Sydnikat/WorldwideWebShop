import {Badge, Box, Flex, Image, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import {CategoryResponse} from "../../types/dto/Category";
import {useNavigationContext} from "../../providers/NavigationContext";
import {homeRoute} from "../../constants/routeConstants";
import {useHistory} from "react-router-dom";

interface CategoryCardProps {
  category: CategoryResponse;
}

const CategoryCard = (props: CategoryCardProps) => {
  const {category} = props;
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const {setChosenCategoryId} = useNavigationContext();

  const chooseCategory = async () => {
    setChosenCategoryId(category.id);
  };

  return (
    <div
      onMouseOver={() => {setIsHovered(true)}}
      onMouseLeave={() => {setIsHovered(false)}}
      onClick={chooseCategory}
      style={{cursor: "pointer"}}
    >
      <Box
        maxW="sm"
        w={300}
        h={100}
        borderWidth="1px"
        borderRadius="md"
        borderColor="lightBlue"

        overflow="inherit"

        boxShadow={isHovered ? "2xl" : "lg"}
        backgroundColor="white"
      >
        <Flex ml="5%" h="100%" w="100%" alignItems="center">
          <Text color="blue.700" fontSize="20px">
            <b>{category.name}</b>
          </Text>
        </Flex>
      </Box>
    </div>
  );
}

export default CategoryCard;

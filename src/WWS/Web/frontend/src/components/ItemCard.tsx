import { StarIcon } from "@chakra-ui/icons";
import {Badge, Box, Image } from "@chakra-ui/react";
import React from "react";

const ItemCard: React.FC = () => {
  const property = {
    imageUrl: "https://bit.ly/2Z4KKcF",
    imageAlt: "Árucikk képe",
    title: "Árucikk neve",
    formattedPrice: "19 000",
    reviewCount: 34,
    rating: 4,
    discount: true
  }

  return (
    <Box maxW="sm" w={280} h={330} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="xl">
      <Image p={2} borderRadius="3xl" src={property.imageUrl} alt={property.imageAlt} />

      <Box p="4">
        <Box
          mt="1"
          mb="1"
          fontWeight="semibold"
          as="h3"
          lineHeight="tight"
          isTruncated
        >
          {property.title}
        </Box>

        <Box d="flex" alignItems="baseline">
          <Box>
            {property.formattedPrice}
            <Box as="span" fontSize="sm">
              Ft
            </Box>
          </Box>
          <Badge ml="2" hidden={!property.discount} borderRadius="full" px="2" colorScheme="red">
            Akció
          </Badge>
        </Box>

        <Box d="flex" mt="2" alignItems="center">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < property.rating ? "teal.500" : "gray.300"}
              />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {property.reviewCount} Vélemények
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ItemCard;

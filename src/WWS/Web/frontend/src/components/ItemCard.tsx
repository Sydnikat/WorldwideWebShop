import { StarIcon } from "@chakra-ui/icons";
import {Badge, Box, Image } from "@chakra-ui/react";
import React, {useState} from "react";
import {ItemResponse} from "../types/InventoryItem";
import {useHistory} from "react-router-dom";
import {inspectRoute} from "../constants/routeConstants";

interface itemData {
  imageUrl: string;
  imageAlt: string;
  title: string;
  formattedPrice: string;
  reviewCount: number;
  rating: number;
  discount: boolean;
}



/*
"https://bit.ly/2Z4KKcF"
 */

const test = {
  imageUrl: "https://images-na.ssl-images-amazon.com/images/I/71z7ztyH1LL._AC_SX466_.jpg",
  imageAlt: "Árucikk képe",
  title: "Árucikk neve",
  formattedPrice: "19 000",
  reviewCount: 34,
  rating: 4,
  discount: true
}

interface ItemCardProps {
  item: ItemResponse | null;
}

const ItemCard = (props: ItemCardProps) => {
  const {item} = props;
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const history = useHistory();

  const property = (item === null) ? test : {
    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/71z7ztyH1LL._AC_SX466_.jpg",
    imageAlt: "Árucikk képe",
    title: item.name,
    formattedPrice: item.price,
    reviewCount: item.ratingCount,
    rating: item.rating !== null ? item.rating : 0,
    discount: item.discountId !== null
  };

  const inspectItem = async () => {
    if (item !== null) {
      history.push(`${inspectRoute}/${item.id}`)
    }
  };

  return (
    <div
      onMouseOver={() => {setIsHovered(true)}}
      onMouseLeave={() => {setIsHovered(false)}}
      onClick={inspectItem}
      style={{cursor: "pointer"}}
    >
      <Box
        maxW="sm"
        w={280}
        h={330}
        borderWidth="1px"
        borderRadius="lg"
        overflow="inherit"

        boxShadow={isHovered ? "2xl" : "lg"}
        backgroundColor="white"
      >
        <Image p={2} mx="auto" boxSize="200px" borderRadius="3xl" src={property.imageUrl} alt={property.imageAlt} />

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
    </div>
  );
}

export default ItemCard;

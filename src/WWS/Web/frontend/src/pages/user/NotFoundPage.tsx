import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text
} from "@chakra-ui/react";
import {homeRoute} from "../../constants/routeConstants";

const NotFoundPage: React.FC<RouteComponentProps> = ({ history }) => {

  const onMainPageSelectedClick = async () => {
    history.push(homeRoute);
  };
  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="50vh"
      backgroundColor="gray.100"
      justifyContent="center"
      alignItems="center"
    >
      <Heading size="4xl" color="blue.600">404</Heading>
      <Text size="xl" my="5" fontWeight="bold" color="blue.600">Valami hiba történt, a keresett oldal nem található</Text>
      <Box>
        <Button
          borderRadius="full"
          colorScheme="blue"
          onClick={onMainPageSelectedClick}>
          Vissza a főoldalra
        </Button>
      </Box>
    </Flex>
  );

}

export default NotFoundPage;

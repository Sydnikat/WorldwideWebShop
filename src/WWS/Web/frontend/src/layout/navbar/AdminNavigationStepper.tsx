import React from "react";
import {useHistory} from "react-router-dom";
import {Box, Button, Flex, Text} from "@chakra-ui/react";

interface IAdminNavigationStepperProps {
}

const AdminNavigationStepper = (props: IAdminNavigationStepperProps) => {
  const history = useHistory();
  const onStepBackSelectedClick = async () => {
    history.goBack();
  }

  return(
    <Box>
      <Flex alignItems="center" justifyContent="start" mx="5">
        <Button
          variant="link"
          fontWeight="bold"
          color="black"
          my="3"
          onClick={onStepBackSelectedClick}
        >
          Vissza
        </Button>
      </Flex>
    </Box>
  );
}

export default AdminNavigationStepper;

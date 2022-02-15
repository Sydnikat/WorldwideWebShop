import React, {Fragment, useContext, useEffect, useState} from "react";
import {RouteComponentProps, useHistory} from "react-router-dom";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {useQuery, useQueryClient} from "react-query";
import {CategoryResponse} from "../../types/dto/Category";
import {homeRoute} from "../../constants/routeConstants";
import {getCategory} from "../../services/queries";
import {AxiosError} from "axios";
import {WWSError} from "../../types/dto/Error";
import {useNavigationContext} from "../../providers/NavigationContext";

interface CustomerNavigationStepperProps {
}

const CustomerNavigationStepper = (props: CustomerNavigationStepperProps) => {
  const history = useHistory();
  const {chosenItem, chosenCategory, resetChosenItem, resetChosenCategory, toggleResetSearch} = useNavigationContext();

  const onMainPageSelectedClick = async () => {
    resetChosenItem();
    resetChosenCategory();
    toggleResetSearch();
    history.push(`${homeRoute}`)
  }

  const onCategorySelectedClick = async () => {
    if (chosenCategory !== undefined) {
      resetChosenItem();
      history.push(`${homeRoute}`)
    }
  }

  return(
    <Box>
      <Flex alignItems="center" justifyContent="start" mx="5">
        <Button
          variant="link"
          fontWeight="bold"
          color="black"
          my="3"
          onClick={onMainPageSelectedClick}
        >
          Főoldal
        </Button>
        {chosenCategory !== null && chosenCategory.name !== "" ?
          <Fragment>
            <Text fontWeight="bold" my="3">&nbsp;{">"}&nbsp;</Text>
            <Button
              variant="link"
              fontWeight="bold"
              color="black"
              my="3"
              onClick={onCategorySelectedClick}
            >
              {chosenCategory?.name}
            </Button>
            {chosenItem !== null ?
              <Fragment>
                <Text fontWeight="bold" my="3">&nbsp;{">"}&nbsp;</Text>
                <Text color="gray.400" fontWeight="bold" mt="4" mb="3">{chosenItem.name}</Text>
              </Fragment>
              : null}
          </Fragment>
        : null}
      </Flex>
    </Box>
  );
}

export default CustomerNavigationStepper;

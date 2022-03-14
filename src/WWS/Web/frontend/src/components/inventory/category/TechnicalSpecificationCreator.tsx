import {NewTechnicalSpecificationRequest} from "../../../types/dto/Category";
import {Box, Flex, Text} from "@chakra-ui/react";
import React, {Fragment, useEffect, useState} from "react";
import {AddIcon, DeleteIcon} from "@chakra-ui/icons";
import {generateInnerId} from "../../../services/helperFunctions";
import TechnicalSpecificationSelect from "./TechnicalSpecificationSelect";

interface ITechnicalSpecificationCreatorProps {
  callback: (requests: NewTechnicalSpecificationRequest[]) => void;
}

export interface INewTechnicalSpecificationWrapper {
  innerId: number;
  newTechSpec: NewTechnicalSpecificationRequest;
}

const TechnicalSpecificationCreator = ({callback}: ITechnicalSpecificationCreatorProps) => {
  const placeholder: NewTechnicalSpecificationRequest = {
    name: "",
    unitOfMeasure: null,
    isBoolean: false,
    isNumber: false,
    isEnumList: false,
    isString: false,
    listOfEnumNames: []
  }
  const [requestWrappers, setRequestWrappers] = useState<INewTechnicalSpecificationWrapper[]>([]);

  useEffect(() => {
    callback(requestWrappers.map(rw => rw.newTechSpec));
  }, [requestWrappers]);


  const addNewWrapper = () => {
    setRequestWrappers(prevState => {
      const newWrapper: INewTechnicalSpecificationWrapper = {
        innerId: generateInnerId(),
        newTechSpec: placeholder
      }
      return [...prevState, newWrapper];
    });
  }

  const removeNewWrapper = (id: number) => () => {
    setRequestWrappers(prevState => {
      return prevState.filter(rw => rw.innerId !== id);
    });
  }

  const updateWrapperData = (wrapper: INewTechnicalSpecificationWrapper) => {
    setRequestWrappers(prevState => {
      const list: INewTechnicalSpecificationWrapper[] = [];
      prevState.forEach(w => {
        if (w.innerId === wrapper.innerId) {
          list.push(wrapper);
        } else {
          list.push(w);
        }
      });
      return list;
    });
  }

  return(
    <Box w="100%">
      <Flex w="100%">
        <Flex w="75%">
          <Text fontSize="20px">
            Specifikációk hozzáadása
          </Text>
        </Flex>
        <Flex w="25%">
          <Box
            as="button"
            _hover={{backgroundColor: "#e9e9e9"}}
            w="100%"
            borderRadius="full"
            bg="white"
            ml="auto"
          >
            <div onClick={addNewWrapper}>
              <AddIcon />
            </div>
          </Box>
        </Flex>
      </Flex>

      <Flex w="100%" direction="column">
        {requestWrappers.map(rw =>
          <Fragment key={`req_wrapper_${rw.innerId}`}>
            <Flex w="100%" h="auto" mt="5%">
              <Flex w="85%" h="auto">
                <TechnicalSpecificationSelect wrapper={rw} callback={updateWrapperData} />
              </Flex>
              <Flex w="15%" px="2%" h="auto" alignContent="center" alignItems="center">
                <Box
                  as="button"
                  _hover={{backgroundColor: "#e9e9e9"}}
                  w="100%"
                  borderRadius="full"
                  bg="white"
                  h="30%"
                >
                  <div onClick={removeNewWrapper(rw.innerId)}>
                    <DeleteIcon />
                  </div>
                </Box>
              </Flex>
            </Flex>
          </Fragment>
        )}
      </Flex>
    </Box>
  );
}

export default TechnicalSpecificationCreator;

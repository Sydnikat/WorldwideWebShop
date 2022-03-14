import {
  TechnicalSpecificationResponse,
  TechnicalSpecificationUpdateRequest
} from "../../../types/dto/Category";
import {Box, Flex, Text} from "@chakra-ui/react";
import React, {Fragment, useEffect, useState} from "react";
import {DeleteIcon} from "@chakra-ui/icons";
import TechnicalSpecificationModifier from "./TechnicalSpecificationModifier";

interface TTechnicalSpecificationEditorProps {
  technicalSpecifications: TechnicalSpecificationResponse[];
  callback: (requests: TechnicalSpecificationUpdateRequest[]) => void;
}

const TechnicalSpecificationEditor = ({technicalSpecifications, callback}: TTechnicalSpecificationEditorProps) => {
  const [requests, setRequests] = useState<TechnicalSpecificationUpdateRequest[]>([]);

  useEffect(() => {
    setRequests(technicalSpecifications.map(technicalSpecification => {
      return {
        id: technicalSpecification.id,
        name: technicalSpecification.name,
        unitOfMeasure: technicalSpecification.unitOfMeasure,
        isEnumList: technicalSpecification.isEnumList,
        isBoolean: technicalSpecification.isBoolean,
        isNumber: technicalSpecification.isNumber,
        isString: technicalSpecification.isString,
        listOfEnumItems: technicalSpecification.listOfEnumItems
      } as TechnicalSpecificationUpdateRequest
    }))
  }, [technicalSpecifications]);

  useEffect(() => {
    callback(requests);
  }, [requests]);

  const removeSpecification = (id: number) => () => {
    console.log(id, requests.map(r => r.id))
    setRequests(prevState => {
      return prevState.filter(s => s.id !== id);
    });
  }

  const updateWrapperData = (request: TechnicalSpecificationUpdateRequest) => {
    setRequests(prevState => {
      const list: TechnicalSpecificationUpdateRequest[] = [];
      prevState.forEach(ts => {
        if (ts.id === request.id) {
          list.push(request);
        } else {
          list.push(ts);
        }
      });
      return list;
    });
  }

  return(
    <Box w="100%">
      <Flex w="100%">
        <Text fontSize="20px">
          Specifikációk módosítása
        </Text>
      </Flex>

      <Flex w="100%" direction="column">
        {requests.map(ts =>
          <Fragment key={`ts_info_${ts.id}`}>
            <Flex w="100%" h="auto" mt="5%">
              <Flex w="85%" h="auto">
                <TechnicalSpecificationModifier techSpecRequest={ts} callback={updateWrapperData} />
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
                  <div onClick={removeSpecification(ts.id!!)}>
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

export default TechnicalSpecificationEditor;

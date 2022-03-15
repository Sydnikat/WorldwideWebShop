import {TechnicalSpecificationResponse} from "../../../types/dto/Category";
import {TechnicalSpecInfoRequest, TechnicalSpecInfoResponse} from "../../../types/dto/InventoryItem";
import React, {Fragment, useEffect, useState} from "react";
import {Box, Flex, Text} from "@chakra-ui/react";
import TechSpecInfoModifier from "./TechSpecInfoModifier";

interface ITechSpecInfoEditorProps {
  technicalSpecifications: TechnicalSpecificationResponse[];
  listOfTechSpecInfo: TechnicalSpecInfoResponse[];
  callback: (requests: TechnicalSpecInfoRequest[]) => void;
}

const TechSpecInfoEditor = (props: ITechSpecInfoEditorProps) => {
  const {technicalSpecifications, listOfTechSpecInfo, callback} = props;

  const [requests, setRequests] = useState<TechnicalSpecInfoRequest[]>(technicalSpecifications.map(ts => {
    const info = listOfTechSpecInfo.find(i => i.technicalSpecificationId == ts.id);
    return {
      id: info?.id ?? null,
      value: info?.value ?? "",
      technicalSpecificationId: ts.id
    } as TechnicalSpecInfoRequest
  }));

  useEffect(() => {
    callback(requests);
  }, [requests]);

  const updateRequests = (request: TechnicalSpecInfoRequest) => {
    setRequests(prevState => {
      const list: TechnicalSpecInfoRequest[] = [];
      prevState.forEach(r => {
        if (r.technicalSpecificationId === request.technicalSpecificationId) {
          list.push(request);
        } else {
          list.push(r);
        }
      });
      return list;
    });
  }

  return(
    <Box w="100%">
      <Flex w="100%">
        <Text fontSize="20px">
          Specifikációk megadása
        </Text>
      </Flex>

      <Flex w="100%" direction="column">
        {technicalSpecifications.map(techSpec => {
          const info = requests.find(r => r.technicalSpecificationId == techSpec.id)!!
          return(
            <Box key={`tech_spec_info_${techSpec.id}`} mb="3">
              <Flex w="100%" h="auto" mt="5%">
                <TechSpecInfoModifier techSpec={techSpec} callback={updateRequests} specInfo={info} />
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

export default TechSpecInfoEditor;

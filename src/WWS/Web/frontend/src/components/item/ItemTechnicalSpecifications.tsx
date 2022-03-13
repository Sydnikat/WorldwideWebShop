import {TechnicalSpecInfoResponse} from "../../types/dto/InventoryItem";
import {TechnicalSpecificationResponse} from "../../types/dto/Category";
import {Box, Flex, Heading, Table, Tbody, Td, Text, Th, Tr} from "@chakra-ui/react";
import React, {Fragment} from "react";

interface IItemTechnicalSpecificationsProps {
  listOfTechSpecInfo: TechnicalSpecInfoResponse[];
  technicalSpecifications: TechnicalSpecificationResponse[];
}

const ItemTechnicalSpecifications = (props: IItemTechnicalSpecificationsProps) => {
  const {listOfTechSpecInfo, technicalSpecifications} = props;

  const tryParseValue = (value: string): string => {
    if (value === "True") {
      return "igen";
    } else {
      return value;
    }
  }

  const generateRow = (specInfo: TechnicalSpecInfoResponse) => {
    const techSpec = technicalSpecifications.find(ts => ts.id === specInfo.technicalSpecificationId)
    if (techSpec !== undefined) {
      const text = techSpec.name + (techSpec.unitOfMeasure ? ` (${techSpec.unitOfMeasure})` : "")
      return (
        <Tr key={`spec_info_${specInfo.id}`}>
          <Td>
            <Text fontSize="20px">
              {text}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="bold" align="end">
              {tryParseValue(specInfo.value)}
            </Text>
          </Td>
        </Tr>
      )
    }
  }

  return(
    <Flex w="100%" direction="column">

      <Box w="100%" textAlign="center" mb="3%">
        <Heading>
          Specifikáció
        </Heading>
      </Box>


      <Flex w="100%" h="20%" textAlign="center" my="2%" >
        <Table variant='striped' colorScheme='gray'>
          <Tbody>
            {listOfTechSpecInfo.map(info => generateRow(info))}
          </Tbody>
        </Table>
      </Flex>

    </Flex>
  );
}

export default ItemTechnicalSpecifications;

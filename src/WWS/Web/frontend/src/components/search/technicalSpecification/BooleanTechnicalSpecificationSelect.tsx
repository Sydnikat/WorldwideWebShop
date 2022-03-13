import {Box, Checkbox, Flex, Text} from "@chakra-ui/react";
import React, {Fragment, useState} from "react";
import {TechnicalSpecificationResponse} from "../../../types/dto/Category";
import {ItemResponse, TechnicalSpecInfoQueryRequest} from "../../../types/dto/InventoryItem";

interface IBooleanTechnicalSpecificationSelectProps {
  items: ItemResponse[];
  techSpec: TechnicalSpecificationResponse;
  techSpecChangedCallback: (requests: TechnicalSpecInfoQueryRequest[]) => void;
}

const BooleanTechnicalSpecificationSelect = (props: IBooleanTechnicalSpecificationSelectProps) => {
  const {techSpec, techSpecChangedCallback, items} = props;
  const unit = techSpec.unitOfMeasure ? `(${techSpec.unitOfMeasure})` : "";
  const [checked, setChecked] = useState<boolean>(false);

  const handleSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (!checked) {
        setChecked(true);
        const request: TechnicalSpecInfoQueryRequest = {stId: techSpec.id, value: "True"};
        techSpecChangedCallback([request]);
      }
    } else {
      if (checked) {
        setChecked(false);
        techSpecChangedCallback([]);
      }
    }
  }


  if (items.length === 0)
    return null;

  return(
    <Fragment>
      <Box my="5" borderColor="grey.800" borderTopWidth="3px" h="0%" />
      <Box w="100%" ml="2%">
        <Flex w="100%" direction="column">
          <Flex mb="3%" w="100%" alignItems="center">
            <Text color="gray" fontSize="30px">
              {`${techSpec.name} ${unit}`}
            </Text>
          </Flex>
          <Flex w="100%" direction="column">
            <Flex width="100%">
              <Checkbox
                colorScheme="gray"
                isChecked={checked}
                onChange={handleSelect}
              >
                <Text fontSize="20px">
                  {`igen (${items.length})`}
                </Text>
              </Checkbox>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Fragment>
  );
}

export default BooleanTechnicalSpecificationSelect;

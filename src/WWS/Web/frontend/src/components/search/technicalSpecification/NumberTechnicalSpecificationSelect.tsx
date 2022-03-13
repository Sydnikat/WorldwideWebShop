import {Box, Checkbox, Flex, Text} from "@chakra-ui/react";
import React, {Fragment, useEffect, useState} from "react";
import {TechnicalSpecificationResponse} from "../../../types/dto/Category";
import {ItemResponse, TechnicalSpecInfoQueryRequest, TechnicalSpecInfoResponse} from "../../../types/dto/InventoryItem";
import NumberInputRange from "../../input/NumberInputRange";

interface INumberTechnicalSpecificationSelectProps {
  items: ItemResponse[];
  techSpec: TechnicalSpecificationResponse;
  techSpecChangedCallback: (requests: TechnicalSpecInfoQueryRequest[]) => void;
}

const getLowestValue = (items: ItemResponse[], techSpec: TechnicalSpecificationResponse): number => {
  const list = items
    .map(i => i.listOfTechnicalSpecInfo.filter(si => si.technicalSpecificationId === techSpec.id))
    .flatMap(x => x);

  if (list.length === 0)
    return 0;

  const valueStr = list.sort((first, second) =>
    parseFloat(first.value) - parseFloat(second.value)
  )[0].value;

  return parseFloat(valueStr);
}

const getHighestValue = (items: ItemResponse[], techSpec: TechnicalSpecificationResponse): number => {
  const list = items
    .map(i => i.listOfTechnicalSpecInfo.filter(si => si.technicalSpecificationId === techSpec.id))
    .flatMap(x => x);

  if (list.length === 0)
    return 0;

  const valueStr = list.sort((first, second) =>
    parseFloat(second.value) - parseFloat(first.value)
  )[0].value;

  return parseFloat(valueStr);
}

const NumberTechnicalSpecificationSelect = (props: INumberTechnicalSpecificationSelectProps) => {
  const {techSpec, techSpecChangedCallback, items} = props;

  const unit = techSpec.unitOfMeasure ? `(${techSpec.unitOfMeasure})` : "";
  const [minPrice, setMinPrice] = useState<number>(getLowestValue(items, techSpec));
  const [maxPrice, setMaxPrice] = useState<number>(getHighestValue(items, techSpec));
  const [currentRange, setCurrentRange] = useState<number[]>([minPrice, maxPrice]);
  const [techSpecChanged, setTechSpecChanged] = useState<boolean>(false);

  useEffect(() => {
    if (techSpecChanged && items.length !== 0) {
      setTechSpecChanged(false);
      const min = getLowestValue(items, techSpec);
      const max = getHighestValue(items, techSpec);
      console.log(min, max, currentRange)
      setMinPrice(min);
      setMaxPrice(max);
      setCurrentRange([min, max]);
    }
  }, [items]);

  useEffect(() => {
    setTechSpecChanged(true);
  }, [techSpec]);


  const handleInputRangeChange = (range: number[]) => {
    setCurrentRange(range);
    if (range[0] === minPrice && range[1] === maxPrice) {
      techSpecChangedCallback([]);
    } else {
      const request: TechnicalSpecInfoQueryRequest = {stId: techSpec.id, range: range};
      techSpecChangedCallback([request]);
    }
  }


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
              <NumberInputRange
                min={minPrice}
                max={maxPrice}
                currentRange={currentRange}
                setCurrentRange={handleInputRangeChange}
                unitOfMeasure={""}
                step={0.1}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Fragment>
  );
}

export default NumberTechnicalSpecificationSelect;

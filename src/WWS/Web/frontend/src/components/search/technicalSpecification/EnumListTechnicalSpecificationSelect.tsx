import {TechnicalSpecEnumListItemResponse, TechnicalSpecificationResponse} from "../../../types/dto/Category";
import {Box, Checkbox, Flex, Text} from "@chakra-ui/react";
import React, {Fragment, useEffect, useState} from "react";
import {ItemResponse, TechnicalSpecInfoQueryRequest} from "../../../types/dto/InventoryItem";

interface IEnumListTechnicalSpecificationSelectProps {
  items: ItemResponse[];
  techSpec: TechnicalSpecificationResponse;
  techSpecChangedCallback: (requests: TechnicalSpecInfoQueryRequest[]) => void;
}

const EnumListTechnicalSpecificationSelect = (props: IEnumListTechnicalSpecificationSelectProps) => {
  const {techSpec, items, techSpecChangedCallback} = props;
  const unit = techSpec.unitOfMeasure ? `(${techSpec.unitOfMeasure})` : "";

  const [selectedEnumListItems, setSelectedEnumListItems] = useState<TechnicalSpecEnumListItemResponse[]>([]);

  const handleSelect = (id: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const alreadySelected = selectedEnumListItems.find(li => li.id === id);
    const listItem = techSpec.listOfEnumItems.find(li => li.id === id)!!;
    if (event.target.checked) {
      if (alreadySelected === undefined) {
        const list = selectedEnumListItems.map(s => {
          return {
            stId: s.technicalSpecificationId,
            value: s.enumName
          } as TechnicalSpecInfoQueryRequest
        });
        list.push({stId: listItem.technicalSpecificationId, value: listItem.enumName});

        setSelectedEnumListItems(prevState => {
          return [...prevState, listItem];
        });

        techSpecChangedCallback(list);
      }
    } else {
      if (alreadySelected !== undefined) {
        const changedList = selectedEnumListItems.filter(li => li.id !== alreadySelected.id);
        const list = changedList.map(s => {
          return {
            stId: s.technicalSpecificationId,
            value: s.enumName
          } as TechnicalSpecInfoQueryRequest
        });

        setSelectedEnumListItems(changedList);

        techSpecChangedCallback(list);
      }
    }
  }

  const getItemCountOfValue = (enumName: string): number =>
    items.filter(item => item.listOfTechnicalSpecInfo.find(si => si.value === enumName) !== undefined).length

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
            {techSpec.listOfEnumItems.map(i => {
              const count = getItemCountOfValue(i.enumName);
              if (count > 0)
                return (
                  <Flex key={`enumItem_${i.id}`} width="100%">
                    <Checkbox
                      colorScheme="gray"
                      isChecked={selectedEnumListItems.find(li => li.id === i.id) !== undefined}
                      onChange={handleSelect(i.id)}
                    >
                      <Text fontSize="20px">
                        {i.enumName} ({count})
                      </Text>
                    </Checkbox>
                  </Flex>
                );
              else return null;
            })}
          </Flex>
        </Flex>
      </Box>
    </Fragment>
  );
}

export default EnumListTechnicalSpecificationSelect;

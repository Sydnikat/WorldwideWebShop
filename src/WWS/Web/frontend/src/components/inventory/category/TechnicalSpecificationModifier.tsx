import {INewTechnicalSpecificationWrapper} from "./TechnicalSpecificationCreator";
import {Box, Flex, FormControl, FormLabel, Select, Text} from "@chakra-ui/react";
import React, {Fragment, useState} from "react";
import TextInput from "../../input/TextInput";
import {Token, Typeahead} from "react-bootstrap-typeahead";
import {
  TechnicalSpecEnumListItemRequest,
  TechnicalSpecificationResponse,
  TechnicalSpecificationUpdateRequest
} from "../../../types/dto/Category";

interface ITechnicalSpecificationModifierProps {
  techSpecRequest: TechnicalSpecificationUpdateRequest;
  callback: (request: TechnicalSpecificationUpdateRequest) => void;
}

interface ICustomOption {
  customOption: boolean;
  label: string;
  id: string;
}

const TechnicalSpecificationModifier = ({techSpecRequest, callback}: ITechnicalSpecificationModifierProps) => {
  const [name, setName] = useState<string>(techSpecRequest.name);
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>(techSpecRequest?.unitOfMeasure ?? "");
  const [enumValues, setEnumValues] = useState<TechnicalSpecEnumListItemRequest[]>(
    techSpecRequest.listOfEnumItems.map(i => {
      return {id: i.id, enumName: i.enumName, technicalSpecificationId: i.technicalSpecificationId}
    })
  );

  const handleNameChange = (v: string) => {
    setName(v);
    techSpecRequest.name = v;
    callback(techSpecRequest);
  }

  const handleUnitOfMeasureChange = (v: string) => {
    setUnitOfMeasure(v);
    techSpecRequest.unitOfMeasure = v !== "" ? v : null;
    callback(techSpecRequest);
  }

  const onSelectedChange = async (options: any) => {
    const customValues = options.filter((o: ICustomOption) => o.customOption !== undefined) as ICustomOption[];
    const enumListItems = options.filter((o: TechnicalSpecEnumListItemRequest) => o.enumName !== undefined) as TechnicalSpecEnumListItemRequest[];
    const newEnumListItems = customValues.map(v => {
      return {id: null, enumName: v.label, technicalSpecificationId: techSpecRequest.id}
    })
    const selected = [...enumListItems, ...newEnumListItems]
    setEnumValues(selected);
    techSpecRequest.listOfEnumItems = selected;
    callback(techSpecRequest)
  };

  const getTypeText = () => {
    if (techSpecRequest.isEnumList)
      return "Lista";
    if (techSpecRequest.isNumber)
      return "Szám érték";
    if (techSpecRequest.isBoolean)
      return "Eldöntendő";
    if (techSpecRequest.isString)
      return "Szöveg";

    return ""
  }

  return(
    <Box w="100%">
      <FormControl mb="3">
        <FormLabel>Specifikáció neve</FormLabel>
        <TextInput value={name} setValue={handleNameChange} placeholder={"Specifikáció 1"} />
      </FormControl>

      <FormControl mb="3">
        <FormLabel>Mértékegység</FormLabel>
        <TextInput value={unitOfMeasure} setValue={handleUnitOfMeasureChange} placeholder={"Mértékegység (nem kötelező!)"} />
      </FormControl>

      <FormControl mb="3">
        <FormLabel>Típus</FormLabel>
        <TextInput value={getTypeText()} setValue={() => {}}  placeholder={""}/>
      </FormControl>

      {techSpecRequest.isEnumList ?
        <Flex w="100%" mb="3">
          <FormControl w="100%" h="auto">
            <FormLabel>Értékek</FormLabel>
            <Flex w="100%" h="auto" my="2">
              <Typeahead
                allowNew
                id={`tech_spec_values_${techSpecRequest.id}`}
                multiple
                newSelectionPrefix="Új érték hozzáadása: "
                options={[]}
                selected={enumValues}
                renderToken={(o, { onRemove }, index) => {
                  const option = o as TechnicalSpecEnumListItemRequest
                  return (
                    <Token
                      key={index}
                      onRemove={onRemove}
                      option={option}>
                      {option.enumName}
                    </Token>
                  )
                }}
                placeholder="Érték 1..."
                onChange={onSelectedChange}
                renderMenuItemChildren={(o: any) => (<></>)}
              />
            </Flex>
          </FormControl>
        </Flex>
        : null}
    </Box>
  );
}
export default TechnicalSpecificationModifier;

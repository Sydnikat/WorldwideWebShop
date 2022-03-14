import {INewTechnicalSpecificationWrapper} from "./TechnicalSpecificationCreator";
import {Box, Flex, FormControl, FormLabel, Select, Text} from "@chakra-ui/react";
import React, {Fragment, useState} from "react";
import TextInput from "../../input/TextInput";
import {Typeahead} from "react-bootstrap-typeahead";

interface ITechnicalSpecificationSelectProps {
  wrapper: INewTechnicalSpecificationWrapper;
  callback: (request: INewTechnicalSpecificationWrapper) => void;
}

interface ICustomOption {
  customOption: boolean;
  label: string;
  id: string;
}

enum TechSpecType {
  BOOLEAN,
  NUMBER,
  STRING,
  LIST,
  NONE
}

const TechnicalSpecificationSelect = ({wrapper, callback}: ITechnicalSpecificationSelectProps) => {
  const [name, setName] = useState<string>("");
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>("");
  const [enumValues, setEnumValues] = useState<string[]>([]);

  const handleNameChange = (v: string) => {
    setName(v);
    wrapper.newTechSpec.name = v;
    callback(wrapper);
  }

  const handleUnitOfMeasureChange = (v: string) => {
    setUnitOfMeasure(v);
    wrapper.newTechSpec.unitOfMeasure = v !== "" ? v : null;
    callback(wrapper);
  }

  const onNewEnumValueSelected = async (options: any) => {
    const selected = options.map((o: ICustomOption) => o.label);
    setEnumValues(selected);
    wrapper.newTechSpec.listOfEnumNames = selected;
    callback(wrapper);
  };

  const onTechnicalSpecificationTypeSelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    const type = parseInt(idStr, 10) as TechSpecType;
    wrapper.newTechSpec.isString = type === TechSpecType.STRING;
    wrapper.newTechSpec.isNumber = type === TechSpecType.NUMBER;
    wrapper.newTechSpec.isEnumList = type === TechSpecType.LIST;
    wrapper.newTechSpec.isBoolean = type === TechSpecType.BOOLEAN;
    wrapper.newTechSpec.listOfEnumNames = type === TechSpecType.LIST ? enumValues : [];
    callback(wrapper);
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
        <FormLabel>Specifikáció típusa</FormLabel>
        <Select
          onChange={onTechnicalSpecificationTypeSelectChange}
          defaultValue={TechSpecType.NONE}
        >
          <option key={`spec_type_d`} value={TechSpecType.NONE} disabled={true}>Válasszon típust</option>
          <option key={`spec_type_b`} value={TechSpecType.BOOLEAN}>Eldöntendő</option>
          <option key={`spec_type_n`} value={TechSpecType.NUMBER}>Szám érték</option>
          <option key={`spec_type_s`} value={TechSpecType.STRING}>Szöveg</option>
          <option key={`spec_type_l`} value={TechSpecType.LIST}>Lista</option>
        </Select>
      </FormControl>

      {wrapper.newTechSpec.isEnumList ?
        <Flex w="100%" mb="3">
          <FormControl w="100%" h="auto">
            <FormLabel>Értékek</FormLabel>
            <Flex w="100%" h="auto" my="2">
              <Typeahead
                allowNew
                id={`tech_spec_values_${wrapper.innerId}`}
                multiple
                newSelectionPrefix="Új érték hozzáadása: "
                options={enumValues}
                placeholder="Érték 1..."
                onChange={onNewEnumValueSelected}
                renderMenuItemChildren={(o: any) => (<></>)}
              />
            </Flex>
          </FormControl>
        </Flex>
        : null}
    </Box>
  );
}
 export default TechnicalSpecificationSelect;

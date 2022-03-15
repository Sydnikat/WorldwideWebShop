import {TechnicalSpecEnumListItemResponse, TechnicalSpecificationResponse} from "../../../types/dto/Category";
import {TechnicalSpecInfoRequest} from "../../../types/dto/InventoryItem";
import {Box, FormControl, FormLabel, Select} from "@chakra-ui/react";
import React, {useState} from "react";
import TextInput from "../../input/TextInput";
import FloatNumberInput from "../../input/FloatNumberInput";

interface ITechSpecInfoModifierProps {
  techSpec: TechnicalSpecificationResponse;
  specInfo: TechnicalSpecInfoRequest;
  callback: (request: TechnicalSpecInfoRequest) => void;
}

enum DecisionType {
  NONE,
  TRUE,
  FALSE,
}

const tryGetDecisionType = (v: string): DecisionType => {
  if (v === "True")
    return DecisionType.TRUE;

  if (v === "False")
    return DecisionType.FALSE;

  return DecisionType.NONE;
}

const tryGetEnumItemId = (v: string, techSpecEnumListItems: TechnicalSpecEnumListItemResponse[]): number => {
  if (v === "")
    return -1;

  const enumItem = techSpecEnumListItems.find(i => i.enumName === v)
  if (enumItem === undefined)
    return -1;

  return enumItem.id;
}

const tryParseFloat = (v: string): number => {
  const num = parseFloat(v)
  if (isNaN(num))
    return 0;

  return num;
}

const TechSpecInfoModifier = ({techSpec, specInfo, callback}: ITechSpecInfoModifierProps) => {
  const [text, setText] = useState<string>(techSpec.isString ? specInfo.value : "");
  const [decimal, setDecimal] = useState<number>(techSpec.isNumber ? tryParseFloat(specInfo.value) : 0);
  const [decision, setDecision] = useState<DecisionType>(techSpec.isBoolean ? tryGetDecisionType(specInfo.value) : DecisionType.NONE);
  const [enumListItemId, setEnumListItemId] = useState<number>(techSpec.isEnumList ? tryGetEnumItemId(specInfo.value, techSpec.listOfEnumItems) : -1);

  const handleTextChange = (v: string) => {
    setText(v);
    specInfo.value = v;
    callback(specInfo);
  }

  const handleDecimalChange = (v: number) => {
    setDecimal(v);
    specInfo.value = `${v}`;
    callback(specInfo);
  }

  const handleDecisionTypeSelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    const type = parseInt(idStr, 10) as DecisionType;
    if (type === DecisionType.TRUE) {
      setDecision(DecisionType.TRUE);
      specInfo.value = "True";
      callback(specInfo);
    }
    if (type === DecisionType.FALSE) {
      setDecision(DecisionType.FALSE);
      specInfo.value = "False";
      callback(specInfo);
    }
  }

  const handleEnumListItemSelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    const selected = techSpec.listOfEnumItems.find(i => i.id === parseInt(idStr, 10));
    if (selected !== undefined) {
      setEnumListItemId(selected.id);
      specInfo.value = selected.enumName;
      callback(specInfo);
    }
  }

  return(
    <Box>
      {techSpec.isString ?
        <FormControl>
          <FormLabel>{techSpec.name}</FormLabel>
          <TextInput value={text} setValue={handleTextChange} placeholder={"Adjon meg egy szöveget..."} />
        </FormControl>
      : null}

      {techSpec.isNumber ?
        <FormControl>
          <FormLabel>{techSpec.name}</FormLabel>
          <FloatNumberInput value={decimal} setValue={handleDecimalChange} />
        </FormControl>
      : null}

      {techSpec.isBoolean ?
        <FormControl>
          <FormLabel>{techSpec.name}</FormLabel>
          <Select
            onChange={handleDecisionTypeSelectChange}
            defaultValue={decision}
          >
            <option key={`dec_type_n`} value={DecisionType.NONE} hidden={true}>Válasszon típust</option>
            <option key={`dec_type_t`} value={DecisionType.TRUE}>Igen</option>
            <option key={`dec_type_f`} value={DecisionType.FALSE}>Nem</option>
          </Select>
        </FormControl>
      : null}

      {techSpec.isEnumList ?
        <FormControl>
          <FormLabel>{techSpec.name}</FormLabel>
          <Select
            onChange={handleEnumListItemSelectChange}
            defaultValue={enumListItemId}
          >
            <option key={`tech_spec_${techSpec.id}_enum_item`} value={-1} hidden={true}>Válasszon a listából</option>
            {techSpec.listOfEnumItems.map(i =>
              <option key={`tech_spec_${techSpec.id}_enum_item_${i.id}`} value={i.id}>{i.enumName}</option>
            )}
          </Select>
        </FormControl>
        : null}
    </Box>
  );
}

export default TechSpecInfoModifier;

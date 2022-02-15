import React from "react";
import {Input, InputGroup, NumberInput, NumberInputField} from "@chakra-ui/react";

interface IFloatNumberInputProps {
  value: number;
  setValue: (v: number) => void;
}

const FloatNumberInput = (props: IFloatNumberInputProps) => {
  const {value, setValue} = props;

  const onFormControlChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(event.target.value);
    if (!isNaN(num)) {
      setValue(num);
    }
  };

  return (
    <NumberInput defaultValue={value}>
      <NumberInputField onChange={onFormControlChange} />
    </NumberInput>
  );
}

export default FloatNumberInput;

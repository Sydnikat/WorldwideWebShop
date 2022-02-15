import {Flex, FormLabel, Input, InputGroup, Textarea} from "@chakra-ui/react";
import React from "react";

interface IDatePickerInputProps {
  value: string;
  setValue: (v: string) => void;
}

const DatePickerInput = (props: IDatePickerInputProps) => {
  const {value, setValue} = props;

  const onDateChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Flex mx="auto" w="100%" alignItems="center" my="4%">
      <Flex alignItems="center">
        <FormLabel>Leárazás vége:</FormLabel>
      </Flex>
      <Flex alignItems="center" ml="auto" mr="2">
        <input type="date" onChange={onDateChange} />
      </Flex>
    </Flex>
  );
}

export default DatePickerInput;

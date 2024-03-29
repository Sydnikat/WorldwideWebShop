import {Input, InputGroup, Textarea} from "@chakra-ui/react";
import React from "react";

interface ITextInputProps {
  value: string;
  setValue: (v: string) => void;
  placeholder: string;
  isTextArea?: boolean;
  disabled?: boolean;
}

const TextInput = (props: ITextInputProps) => {
  const {value, setValue, placeholder, isTextArea, disabled} = props;

  const onTextChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onTextAreaChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  if (isTextArea) {
    return (
      <InputGroup>
        <Textarea
          onChange={onTextAreaChange}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
        />
      </InputGroup>
    );
  }

  return (
    <InputGroup>
      <Input
        onChange={onTextChange}
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
      />
    </InputGroup>
  );
}

export default TextInput;

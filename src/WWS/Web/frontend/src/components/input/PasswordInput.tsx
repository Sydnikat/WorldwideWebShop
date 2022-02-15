import {Button, Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import React, {useState} from "react";

interface IPasswordInputProps {
  value: string;
  setValue: (v: string) => void;
  placeholder?: string
}

const PasswordInput = (props: IPasswordInputProps) => {
  const {value, setValue, placeholder} = props;
  const [showPassword, setShowPassword] = useState(false);

  const onFormControlChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <InputGroup>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder !== undefined ? placeholder : "Jelszó"}
        value={value}
        onChange={onFormControlChange}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
          {showPassword ? "Elrejt" : "Mutat"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default PasswordInput;

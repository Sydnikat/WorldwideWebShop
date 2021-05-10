import React, {useState} from "react";
import {
  Input,
  InputGroup,
  Stack,
  Box,
  FormControl,
} from "@chakra-ui/react";

enum InputType {
  ZIP,
  CITY,
  STREET
}

interface UserAddressProps {
  zip: string;
  street: string;
  city: string;
  setZip: React.Dispatch<React.SetStateAction<string>>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setStreet: React.Dispatch<React.SetStateAction<string>>;
}

const UserAddress = (props: UserAddressProps) => {
  const {zip, street, city, setCity, setStreet, setZip} = props;

  const onFormControlChange = (type: InputType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {value} = event.target;
    switch (type) {
      case InputType.ZIP:
        setZip(value);
        break;
      case InputType.STREET:
        setStreet(value);
        break;
      case InputType.CITY:
        setCity(value);
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      <FormControl mb="4">
        <InputGroup>
          <Input
            onChange={onFormControlChange(InputType.ZIP)}
            type="text"
            placeholder="Irányítószám"
            value={zip}
          />
        </InputGroup>
      </FormControl>
      <FormControl mb="4">
        <InputGroup>
          <Input
            onChange={onFormControlChange(InputType.CITY)}
            type="text"
            placeholder="Város"
            value={city}
          />
        </InputGroup>
      </FormControl>
      <FormControl mb="4">
        <InputGroup>
          <Input
            onChange={onFormControlChange(InputType.STREET)}
            type="text"
            placeholder="Utca"
            value={street}
          />
        </InputGroup>
      </FormControl>
    </Box>
  );

}

export default UserAddress;

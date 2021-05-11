
import React, {useState} from "react";
import {
  Input,
  InputGroup,
  Stack,
  Box,
  FormControl,
} from "@chakra-ui/react";
import UserAddress from "./UserAddress";

enum InputType {
  EMAIL,
  PHONE
}

interface UserProfileProps {
  zip: string;
  street: string;
  city: string;
  email: string;
  phone: string;
  setZip: React.Dispatch<React.SetStateAction<string>>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setStreet: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}

const UserProfile = (props: UserProfileProps) => {
  const {
    zip,
    street,
    city,
    email,
    phone,
    setCity,
    setStreet,
    setZip,
    setPhone,
    setEmail
  } = props;

  const onFormControlChange = (type: InputType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {value} = event.target;
    switch (type) {
      case InputType.EMAIL:
        setEmail(value);
        break;
      case InputType.PHONE:
        setPhone(value);
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
            type="email"
            placeholder="Email cím"
            onChange={onFormControlChange(InputType.EMAIL)}
            value={email}
          />
        </InputGroup>
      </FormControl>
      <FormControl mb="4">
        <InputGroup>
          <Input
            onChange={onFormControlChange(InputType.PHONE)}
            type="text"
            placeholder="Telefonszám"
            value={phone}
          />
        </InputGroup>
      </FormControl>

      <UserAddress
        zip={zip}
        street={street}
        city={city}
        setCity={setCity}
        setStreet={setStreet}
        setZip={setZip}
      />
    </Box>
  );

}

export default UserProfile;

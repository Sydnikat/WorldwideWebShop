import React, {useState} from "react";
import {Box, Flex, FormControl, Heading, Input, InputGroup, Spinner, useToast, Text, Button} from "@chakra-ui/react";
import UserAddress from "./UserAddress";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {CartResponse} from "../../types/dto/Cart";
import {WWSError} from "../../types/dto/Error";
import {deleteMyCart, getMyCart, getMyProfile, updateMyProfile} from "../../services/queries";
import {AddressUpdateRequest, UserResponse, UserUpdateRequest} from "../../types/dto/User";
import {AxiosError} from "axios";

enum InputType {
  ZIP,
  CITY,
  STREET,
  PHONE,
  FULL_NAME
}

const ModifyProfile = () => {
  const client = useQueryClient();
  const toast = useToast();
  const [fullName, setFullName] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const { data: profile } = useQuery<UserResponse, WWSError>(
    "profile",
    () => getMyProfile(),
    {
      retry: 1,
      onSuccess: data => {
        setPhone(data.phone);
        setFullName(data.userFullName);
        setStreet(data.address.street);
        setCity(data.address.city);
        setZip(data.address.zip);
      }
    });

  const {mutateAsync: updateProfile, isLoading} = useMutation(updateMyProfile, {
    onSuccess: async (data) => {
      await client.setQueryData("profile", data);
    },
    onError: (error: AxiosError<WWSError>) => {
      const response = error.response;
      const status = response?.status;
      if (status === 401 || status === 400) {
        let errorText = "Hiba a profil mentése során...";
        if (response !== undefined && response.data !== undefined && response.data.message !== undefined) {
          errorText = response.data.message
        }
        toast({
          title: `${errorText}`,
          position: "top-right",
          status: "error",
          isClosable: true,
          duration: 4000,
        });
      }
    }
  });

  const saveProfile = async () => {
    const addressRequest: AddressUpdateRequest = {
      zip, street, city, countryCode: "hu"
    };

    const request: UserUpdateRequest = {
      userFullName: fullName,
      phone: phone,
      address: addressRequest
    };

    try {
      await updateProfile(request);
    } catch (e) {}
  };

  const onFormControlChange = (type: InputType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {value} = event.target;
    switch (type) {
      case InputType.FULL_NAME:
        setFullName(value);
        break;
      case InputType.PHONE:
        setPhone(value);
        break;
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

  if (profile === undefined) {
    return (
      <Box w={400} overflow="hidden" py="10%">
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </Box>
    )
  }

  return (
    <Flex w="90%" mx="auto" my="2" alignItems="center" justifyContent="center" direction="column">
      <Heading textAlign="center" my="4">
        Profilom
      </Heading>
      <FormControl mb="4">
        <InputGroup alignItems="center">
          <Text w="35%">Teljes név:</Text>
          <Input
            w="65%"
            type="text"
            placeholder="Teljes név"
            onChange={onFormControlChange(InputType.FULL_NAME)}
            value={fullName}
          />
        </InputGroup>
      </FormControl>
      <FormControl mb="4">
        <InputGroup alignItems="center">
          <Text w="35%">Telefonszám:</Text>
          <Input
            w="65%"
            onChange={onFormControlChange(InputType.PHONE)}
            type="text"
            placeholder="Telefonszám"
            value={phone}
          />
        </InputGroup>
      </FormControl>
      <FormControl mb="4">
        <InputGroup alignItems="center">
          <Text w="35%">Irányítószám:</Text>
          <Input
            w="65%"
            onChange={onFormControlChange(InputType.ZIP)}
            type="text"
            placeholder="Irányítószám"
            value={zip}
          />
        </InputGroup>
      </FormControl>
      <FormControl mb="4">
        <InputGroup alignItems="center">
          <Text w="35%">Város:</Text>
          <Input
            w="65%"
            onChange={onFormControlChange(InputType.CITY)}
            type="text"
            placeholder="Város"
            value={city}
          />
        </InputGroup>
      </FormControl>
      <FormControl mb="4">
        <InputGroup alignItems="center">
          <Text w="35%">Utca:</Text>
          <Input
            w="65%"
            onChange={onFormControlChange(InputType.STREET)}
            type="text"
            placeholder="Utca"
            value={street}
          />
        </InputGroup>
      </FormControl>
      <Flex alignItems="center" justifyContent="center" mx="auto" w="70%" my="5%">
        <Button
          w="70%"
          borderRadius="full"
          colorScheme="red"
          variant="solid"
          disabled={isLoading}
          onClick={saveProfile}
        >
          Mentés
        </Button>
      </Flex>
    </Flex>
  );
}

export default ModifyProfile;

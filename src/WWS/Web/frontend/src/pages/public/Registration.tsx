import {RouteComponentProps} from "react-router-dom";
import React, {useState} from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement, useToast
} from "@chakra-ui/react";
import {homeRoute, loginRoute, registerRoute} from "../../constants/routeConstants";
import { LockIcon, AddIcon } from "@chakra-ui/icons";
import UserAddress from "../../components/user/UserAddress";
import {useMutation} from "react-query";
import {login, register} from "../../services/queries";
import {saveUser} from "../../services/helperFunctions";
import {CUSTOMER} from "../../constants/roleConstants";
import {AxiosError} from "axios";
import {WWSError} from "../../types/dto/Error";
import {AddressRequest, LoginRequest, RegisterRequest} from "../../types/dto/User";

enum InputType {
  USERNAME,
  PASSWORD,
  CONFIRM,
  EMAIL,
  FULL_NAME,
  PHONE
}

const Registration: React.FC<RouteComponentProps> = ({ history }) => {

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [userFullName, setUserFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [inTransaction, setInTransaction] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<boolean>(false);
  const [signupErrorText, setSignupErrorText] = useState<string | null>(null);

  const toast = useToast();

  const {mutateAsync: registerMutation} = useMutation(register, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast({
          title: `Sikeres regisztráció`,
          position: "top-right",
          status: "success",
          isClosable: true,
          duration: 10000,
        });
        history.push(loginRoute);
      }
    },
    onError: (error: AxiosError<WWSError>) => {
      const response = error.response;
      const status = response?.status;
      if (status === 401 || status === 400) {
        let errorText = "Sikertelen regisztráció";
        if (response !== undefined && response.data !== undefined) {
          errorText = response.data.message;
        }
        toast({
          title: `${errorText}`,
          position: "top-right",
          status: "error",
          isClosable: true,
          duration: 2000,
        });
      }
    },
    onSettled: (data, error) => {
      setInTransaction(false);
      setUserName("");
      setPassword("");
      setConfirmPassword("");
    }
  });

  const onFormControlChange = (type: InputType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {value} = event.target;
    switch (type) {
      case InputType.USERNAME:
        setUserName(value);
        break;
      case InputType.PASSWORD:
        setPassword(value);
        break;
      case InputType.CONFIRM:
        setConfirmPassword(value);
        break;
      case InputType.EMAIL:
        setEmail(value);
        break;
      case InputType.FULL_NAME:
        setUserFullName(value);
        break;
      case InputType.PHONE:
        setPhone(value);
        break;
      default:
        break;
    }
  };

  const onSignupClick = async () => {
    if (userName === "")
      return;

    if (password === "" || confirmPassword === null)
      return;

    if (password !== confirmPassword)
      return;

    const address: AddressRequest = {
      city, zip, street, countryCode: "hu"
    };

    const request: RegisterRequest = {
      address, password, confirmPassword, email, phone, userFullName, userName
    };

    setInTransaction(true);
    try {
      await registerMutation(request);
    } catch (e) {}
  };

  const onSigninClick = async () => {
    history.push(loginRoute);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.100"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="2xl" my="2" color="blue.600">Regisztráció</Heading>
        <Box minW={{ base: "90%", md: "500px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="white"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <Input
                    onChange={onFormControlChange(InputType.USERNAME)}
                    type="text"
                    placeholder="felhasználónév"
                    value={userName}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input
                    onChange={onFormControlChange(InputType.FULL_NAME)}
                    type="text"
                    placeholder="Teljes név"
                    value={userFullName}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Jelszó"
                    onChange={onFormControlChange(InputType.PASSWORD)}
                    value={password}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Elrejt" : "Mutat"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Jelszó mégegyszer"
                    borderColor={(confirmPassword !== "" && password === confirmPassword) ? "green" : "crimson"}
                    onChange={onFormControlChange(InputType.CONFIRM)}
                    value={confirmPassword}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Elrejt" : "Mutat"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input
                    type="email"
                    placeholder="Email cím"
                    onChange={onFormControlChange(InputType.EMAIL)}
                    value={email}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
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

              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="blue"
                width="full"
                onClick={onSignupClick}
                disabled={inTransaction}
              >
                Regisztrálok
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        <Button variant="link" color="blue" onClick={onSigninClick}>
          Vissza a belépéshez
        </Button>
      </Box>
    </Flex>
  );

}

export default Registration;

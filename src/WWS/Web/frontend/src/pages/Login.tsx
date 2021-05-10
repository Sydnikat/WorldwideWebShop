import {RouteComponentProps} from "react-router-dom";
import React, {useState} from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  Avatar,
  FormControl,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
import {homeRoute, registerRoute} from "../constants/routeConstants";
import {LoginRequest, User} from "../types/User";
import {useMutation} from "react-query";
import { login } from "../services/queries";
import {saveUser} from "../services/helperFunctions";
import {CUSTOMER} from "../constants/roleConstants";
import {AxiosError} from "axios";
import {WWSError} from "../types/Error";

enum InputType {
  USERNAME,
  PASSWORD,
}

const Login: React.FC<RouteComponentProps> = ({ history }) => {

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [inTransaction, setInTransaction] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();

  const onFormControlChange = (type: InputType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (type) {
      case InputType.USERNAME:
        setUserName(event.target.value);
        break;
      case InputType.PASSWORD:
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  const {mutateAsync: loginMutation} = useMutation(login, {
    onSuccess: (user) => {
      saveUser(user);

      if (user.roles.includes(CUSTOMER)) {
        history.push(homeRoute);
      }
    },
    onError: (error: AxiosError<WWSError>) => {
      const response = error.response;
      const status = response?.status;
      if (status === 401 || status === 400) {
        let errorText = "Sikertelen regisztráció";
        if (response !== undefined && response.data !== undefined && response.data.message !== undefined) {
          errorText = response.data.message
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
    }
  });

  const onSigninClick = async () => {
    if (userName !== "" && password !== "") {
      setInTransaction(true);
      const request: LoginRequest = { userName, password, role: "Customer" };
      try {
        await loginMutation(request);
      } catch (e) {}
    }
  };

  const onSignupClick = () => {
    history.push(registerRoute);
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <>
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
          <Avatar bg="blue.600" />
          <Heading color="blue.600">WorldwideWebShop</Heading>
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Jelszó"
                      value={password}
                      onChange={onFormControlChange(InputType.PASSWORD)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Elrejt" : "Mutat"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  borderRadius={0}
                  variant="solid"
                  colorScheme="blue"
                  width="full"
                  disabled={inTransaction}
                  onClick={onSigninClick}
                >
                  Belépés
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>

        <Box>
          Még nincs fiókja?{" "}
          <Button variant="link" color="blue" onClick={onSignupClick}>
            Regisztráció
          </Button>
        </Box>
      </Flex>
    </>
  );

}

export default Login;

import {RouteComponentProps} from "react-router-dom";
import React, {useState} from "react";
import {
  Flex,
  Button,
  Stack,
  Box,
  useToast, Heading
} from "@chakra-ui/react";
import {adminHomeRoute, homeRoute} from "../../constants/routeConstants";
import {LoginRequest} from "../../types/dto/User";
import {useMutation} from "react-query";
import { login } from "../../services/queries";
import {saveUser} from "../../services/helperFunctions";
import {ADMIN} from "../../constants/roleConstants";
import {AxiosError} from "axios";
import {WWSError} from "../../types/dto/Error";
import TextInput from "../../components/input/TextInput";
import PasswordInput from "../../components/input/PasswordInput";

const AdminLogin: React.FC<RouteComponentProps> = ({ history }) => {

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [inTransaction, setInTransaction] = useState<boolean>(false);

  const toast = useToast();

  const {mutateAsync: loginMutation} = useMutation(login, {
    onSuccess: (user) => {
      saveUser(user);

      if (user.roles.includes(ADMIN)) {
        history.push(adminHomeRoute);
      }
    },
    onError: (error: AxiosError<WWSError>) => {
      const status = error.response?.status;
      if (status === 401 || status === 400) {
        toast({
          title: "Sikertelen belépés",
          position: "top-right",
          status: "error",
          isClosable: true,
          duration: 2000,
        });
      }
    },
    onSettled: (data, error) => {
      if (data === undefined) {
        setInTransaction(false);
        setUserName("");
        setPassword("");
      }
    }
  });

  const onSigninClick = async () => {
    if (userName !== "" && password !== "") {
      setInTransaction(true);
      const request: LoginRequest = { userName, password, role: "Admin" };
      try {
        await loginMutation(request);
      } catch (e) {}
    }
  };

  return (
    <>
      <Flex
        flexDirection="column"
        width="100wh"
        height="80vh"
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
          <Box minW={{ base: "90%", md: "500px" }}>
            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="white"
                boxShadow="md"
              >
                <Heading textAlign="center" color="gray.600">Belépés</Heading>

                <TextInput value={userName} setValue={setUserName} placeholder={"felhasználónév"} />

                <PasswordInput value={password} setValue={setPassword} />

                <Button
                  borderRadius={0}
                  variant="solid"
                  colorScheme="gray"
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

      </Flex>
    </>
  );

}

export default AdminLogin;

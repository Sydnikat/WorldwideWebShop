import {User} from "../types/dto/User";
import {WWSError} from "../types/dto/Error";
import {useToast} from "@chakra-ui/react";
import {AxiosError} from "axios";

export const saveUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const getUser = (): User | null => {
  const str = localStorage.getItem("user")
  return str !== null ? JSON.parse(str) : null
}

export const cleanUser = () => {
  localStorage.removeItem("user")
}

/*
export const createErrorToast = (error: AxiosError<WWSError>, defaultTest: string, uptime = 2000) => {
  const toast = useToast();

  const response = error.response;
  const status = response?.status;
  if (status === 401 || status === 400) {
    let errorText = defaultTest;
    if (response !== undefined && response.data !== undefined && response.data.message !== undefined) {
      errorText = response.data.message
    }
    toast({
      title: `${errorText}`,
      position: "top-right",
      status: "error",
      isClosable: true,
      duration: uptime,
    });
  }
}

 */

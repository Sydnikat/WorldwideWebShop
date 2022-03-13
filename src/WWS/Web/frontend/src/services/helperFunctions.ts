import {User} from "../types/dto/User";
import {WWSError} from "../types/dto/Error";
import {useToast} from "@chakra-ui/react";
import {AxiosError} from "axios";
import {Sorting, SortingDirection} from "../types/enum/SortingDirection";
import {SortingType} from "../types/enum/SortingType";

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

export const getSortBy = (v: Sorting): SortingType | undefined => {
  switch (v) {
    case Sorting.PRICE_ASC: return SortingType.PRICE;
    case Sorting.PRICE_DESC: return SortingType.PRICE;
    case Sorting.SCORE_DESC: return SortingType.RATING;
    case Sorting.UNSORTED: return undefined;
  }
}

export const getSortDirection = (v: Sorting): SortingDirection | undefined => {
  switch (v) {
    case Sorting.PRICE_ASC: return SortingDirection.ASC;
    case Sorting.PRICE_DESC: return SortingDirection.DESC;
    case Sorting.SCORE_DESC: return SortingDirection.DESC;
    case Sorting.UNSORTED: return undefined;
  }
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

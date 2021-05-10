import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {getUser} from "../helperFunctions";

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const user = getUser();
  if (user !== null && user.accessToken !== "") {
    request.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.accessToken}`,
    };
  } else {
    request.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  return request;
}, error => {
  return Promise.reject(error);
});

export {axiosInstance};

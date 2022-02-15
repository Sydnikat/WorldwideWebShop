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

  console.info(`Starting request: ${request?.method} ${request?.url}`);
  console.info(request);
  console.debug(request);

  return request;
}, error => {
  console.error("Request error:", error?.response);
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => {
    console.debug(response);
    return response;
  }
);

export {axiosInstance};

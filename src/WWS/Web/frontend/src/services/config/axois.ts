import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const accessToken = "";
  if (accessToken !== "") {
    request.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
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

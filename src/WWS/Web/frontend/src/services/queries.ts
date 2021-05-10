import {LoginRequest, RegisterRequest, User} from "../types/User";
import {axiosInstance} from "./config/axios";
import {authServiceUrl, inventoryServiceUrl} from "../constants/url";
import {AxiosError, AxiosResponse} from "axios";
import {WWSError} from "../types/Error";
import {CategoryResponse} from "../types/Category";
import {ItemResponse} from "../types/InventoryItem";
import {ReviewResponse} from "../types/Review";

export const login = async (request: LoginRequest): Promise<User> => {
  try {
    const response = await axiosInstance.post(`${authServiceUrl}/signin`, request);
    return  response.data as User;
  } catch (e: any) {
    throw e as AxiosError<WWSError>
  }
}

export const register = async (request: RegisterRequest): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.post(`${authServiceUrl}/signup`, request);
  } catch (e: any) {
    throw e as AxiosError<WWSError>
  }
}

export const getCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/categories`);
    return  response.data as CategoryResponse[];
  } catch (e: any) {
    throw e as AxiosError<WWSError>
  }
}

export const getItemsOfCategory = async (categoryId: number): Promise<ItemResponse[]> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/categories/${categoryId}/items`);
    return  response.data as ItemResponse[];
  } catch (e: any) {
    throw e as AxiosError<WWSError>
  }
}

export const getItem = async (itemId: number): Promise<ItemResponse> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/items/${itemId}`);
    return  response.data as ItemResponse;
  } catch (e: any) {
    throw e as AxiosError<WWSError>
  }
}

export const getItemReviews = async (itemId: number): Promise<ReviewResponse[]> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/items/${itemId}/reviews`);
    return  response.data as ReviewResponse[];
  } catch (e: any) {
    throw e as AxiosError<WWSError>
  }
}

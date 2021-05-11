import {LoginRequest, RegisterRequest, User, UserResponse, UserUpdateRequest} from "../types/User";
import {axiosInstance} from "./config/axios";
import {authServiceUrl, inventoryServiceUrl, orderServiceUrl, userServiceUrl} from "../constants/url";
import {AxiosError, AxiosResponse} from "axios";
import {WWSError} from "../types/Error";
import {CategoryResponse} from "../types/Category";
import {ItemResponse} from "../types/InventoryItem";
import {NewReviewRequest, ReviewResponse} from "../types/Review";
import {cleanUser} from "./helperFunctions";
import {CartResponse, UpdateCartRequest} from "../types/Cart";
import {OrderResponse} from "../types/Order";

const maskError = (e: any): AxiosError<WWSError> => {
  const err = e as AxiosError<WWSError>;
  if (err.response?.status === 401) {
    cleanUser()
  }
  return err;
}

export const login = async (request: LoginRequest): Promise<User> => {
  try {
    const response = await axiosInstance.post(`${authServiceUrl}/signin`, request);
    return  response.data as User;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const register = async (request: RegisterRequest): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.post(`${authServiceUrl}/signup`, request);
  } catch (e: any) {
    throw maskError(e);
  }
}

export const getCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/categories`);
    return  response.data as CategoryResponse[];
  } catch (e: any) {
    throw maskError(e);
  }
}

export const getCategory = async (categoryId: number): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/categories/${categoryId}`);
    return  response.data as CategoryResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const getItemsOfCategory = async (categoryId: number): Promise<ItemResponse[]> => {
  try {
    if (categoryId === -1) {
      const response = await axiosInstance.get(`${inventoryServiceUrl}/items?=size=1000`);
      return  response.data as ItemResponse[];
    } else {
      const response = await axiosInstance.get(`${inventoryServiceUrl}/categories/${categoryId}/items?=size=1000`);
      return  response.data as ItemResponse[];
    }
  } catch (e: any) {
    throw maskError(e);
  }
}

export const getItem = async (itemId: number): Promise<ItemResponse> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/items/${itemId}`);
    return  response.data as ItemResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const getItemReviews = async (itemId: number): Promise<ReviewResponse[]> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/items/${itemId}/reviews`);
    return  response.data as ReviewResponse[];
  } catch (e: any) {
    throw maskError(e);
  }
}

export interface PostReviewBody {
  itemId: number;
  request: NewReviewRequest;
}
export const postReview = async (body: PostReviewBody): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.post(`${inventoryServiceUrl}/items/${body.itemId}/reviews`, body.request);
    return  response.data as ReviewResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const deleteMyReview = async (reviewId: number): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.delete(`${inventoryServiceUrl}/reviews/${reviewId}`);
  } catch (e: any) {
    throw maskError(e);
  }
}

export const getMyProfile = async (): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get(`${userServiceUrl}/me`);
    return  response.data as UserResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const updateMyProfile = async (request: UserUpdateRequest): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.put(`${userServiceUrl}/me`, request);
    return  response.data as UserResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const getMyCart = async (): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.get(`${orderServiceUrl}/carts/me`);
    return  response.data as CartResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const updateMyCart = async (request: UpdateCartRequest): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.put(`${orderServiceUrl}/carts/me`, request);
    return  response.data as CartResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const deleteMyCart = async (): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.delete(`${orderServiceUrl}/carts/me`);
  } catch (e: any) {
    throw maskError(e);
  }
}

export const checkoutMyCart = async (): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.post(`${orderServiceUrl}/carts/me/checkout`);
    return  response.data as OrderResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const getMyOrder = async (orderCode: string): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.get(`${orderServiceUrl}/orders/${orderCode}`);
    return  response.data as OrderResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

export const finishMyOrder = async (orderCode: string): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.post(`${orderServiceUrl}/orders/${orderCode}/finish`);
    return  response.data as OrderResponse;
  } catch (e: any) {
    throw maskError(e);
  }
}

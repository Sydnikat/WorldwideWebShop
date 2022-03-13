import {
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResult,
  RegisterRequest,
  User,
  UserResponse,
  UserUpdateRequest
} from "../types/dto/User";
import {axiosInstance} from "./config/axios";
import {authServiceUrl, baseUrl, inventoryServiceUrl, orderServiceUrl, userServiceUrl} from "../constants/url";
import {AxiosError, AxiosResponse} from "axios";
import {WWSError} from "../types/dto/Error";
import {CategoryResponse, NewCategoryRequest, TechnicalSpecificationUpdateRequest} from "../types/dto/Category";
import {
  ItemQueryResultResponse,
  ItemResponse,
  NewItemRequest,
  TechnicalSpecInfoQueryRequest,
  UpdateItemRequest
} from "../types/dto/InventoryItem";
import {NewReviewRequest, ReviewResponse} from "../types/dto/Review";
import {cleanUser, getUser, saveUser} from "./helperFunctions";
import {CartResponse, UpdateCartRequest} from "../types/dto/Cart";
import {OrderResponse} from "../types/dto/Order";
import {SortingDirection} from "../types/enum/SortingDirection";
import {SortingType} from "../types/enum/SortingType";
import {DiscountResponse, NewDiscountRequest} from "../types/dto/Discount";

const maskError = async (e: any): Promise<AxiosError<WWSError>> => {
  const err = await e as AxiosError<WWSError>;
  if (err.response?.status === 401) {
    let user = getUser();
    if (user !== null) {
      const request: RefreshTokenRequest = { refreshToken: user.refreshToken }

      try {
        const response = await axiosInstance.post(`${authServiceUrl}/refresh-token`, request);
        const result = response.data as RefreshTokenResult;
        user.accessToken = result.accessToken;
        saveUser(user);
      } catch (refreshErr: any) {
        const refreshError = refreshErr as AxiosError<WWSError>;
        if (refreshError.response?.status === 401) {
          cleanUser();
          window.location.replace(`${baseUrl}/login`);
        }
      }

    } else {
      window.location.replace(`${baseUrl}/login`);
    }
  }
  return err;
}

export const login = async (request: LoginRequest): Promise<User> => {
  try {
    const response = await axiosInstance.post(`${authServiceUrl}/signin`, request);
    return  response.data as User;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const register = async (request: RegisterRequest): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.post(`${authServiceUrl}/signup`, request);
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const getCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/categories`);
    return  response.data as CategoryResponse[];
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const getCategory = async (categoryId: number): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/categories/${categoryId}`);
    return  response.data as CategoryResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const createCategory = async (request: NewCategoryRequest): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.post(`${inventoryServiceUrl}/categories`, request);
    return  response.data as CategoryResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export interface UpdateTechSpecsBody {
  categoryId: number;
  requests: TechnicalSpecificationUpdateRequest[];
}
export const updateTechnicalSpecifications = async (body: UpdateTechSpecsBody): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.post(`${inventoryServiceUrl}/categories${body.categoryId}/techSpecs`, body.requests);
    return  response.data as CategoryResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const deleteCategory = async (categoryId: number): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.delete(`${inventoryServiceUrl}/categories/${categoryId}`);
  } catch (e: any) {
    throw await maskError(e);
  }
}

export interface PostItemBody {
  categoryId: number;
  request: NewItemRequest;
}
export const createItem = async (body: PostItemBody): Promise<ItemResponse> => {
  try {
    const response = await axiosInstance.post(`${inventoryServiceUrl}/categories/${body.categoryId}/items`, body.request);
    return  response.data as ItemResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export interface UpdateItemBody {
  itemId: number;
  request: UpdateItemRequest;
}
export const updateItem = async (body: UpdateItemBody): Promise<ItemResponse> => {
  try {
    const response = await axiosInstance.put(`${inventoryServiceUrl}/items/${body.itemId}`, body.request);
    return  response.data as ItemResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

interface GetItemsOfCategoryBody {
  categoryId: number;
  number_per_page?: number;
  page?: number;
}
export const getItemsOfCategory = async (body: GetItemsOfCategoryBody): Promise<ItemResponse[]> => {
  const size = body.number_per_page ?? 100;
  const offset = body.page ?? 0;
  const paging = `size=${size}&offset=${offset}`;
  try {
    if (body.categoryId === -1) {
      const response = await axiosInstance.get(`${inventoryServiceUrl}/items?${paging}`);
      return  response.data as ItemResponse[];
    } else {
      const response = await axiosInstance.get(`${inventoryServiceUrl}/categories/${body.categoryId}/items?${paging}`);
      return  response.data as ItemResponse[];
    }
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const getItem = async (itemId: number): Promise<ItemResponse> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/items/${itemId}`);
    return  response.data as ItemResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const deleteItem = async (itemId: number): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.delete(`${inventoryServiceUrl}/items/${itemId}`);
  } catch (e: any) {
    throw await maskError(e);
  }
}

interface SearchItemsBody {
  itemName?: string,
  categories?: number[],
  sortDirection?: SortingDirection,
  sortBy?: SortingType,
  hasStock?: boolean,
  priceRange?: number[],
  techSpecRequests?: TechnicalSpecInfoQueryRequest[],
}
export const searchItems = async (
  body: SearchItemsBody
): Promise<ItemQueryResultResponse> => {
  const {
    itemName,
    categories,
    sortDirection,
    sortBy,
    hasStock,
    priceRange,
    techSpecRequests
  } = body;
  let query = itemName !== undefined ? `q=${itemName}` : "";
  if (categories !== undefined && categories.length > 0) {
    let cats = "";
    categories.forEach(c => cats += `${c},`);
    cats = cats.substring(0, cats.length - 1);
    query += `&cat=${cats}`
  }
  if (sortDirection !== undefined) {
    let sortValue = "unsorted"
    switch (sortDirection) {
      case SortingDirection.ASC: sortValue = "asc"; break;
      case SortingDirection.DESC: sortValue = "desc"; break;
      default: break;
    }
    query += `&sort=${sortValue}`
  }
  if (sortBy !== undefined) {
    let sortByValue = "unsorted"
    switch (sortBy) {
      case SortingType.RATING: sortByValue = "score"; break;
      case SortingType.PRICE: sortByValue = "price"; break;
      default: break;
    }
    query += `&sortBy=${sortByValue}`
  }
  if (hasStock !== undefined) {
    query += `&stock=${hasStock}`
  }
  if (priceRange !== undefined && priceRange.length === 2) {
    query += `&price=${priceRange[0]},${priceRange[1]}`
  }
  if (techSpecRequests !== undefined && techSpecRequests.length > 0) {
    let elements = "";
    techSpecRequests.map(r => {
      if (r.value !== undefined) {
        elements += `stId=${r.stId},v=${r.value};`
      }
      if (r.range !== undefined && r.range.length === 2) {
        elements += `stId=${r.stId},r=${r.range[0]}-${r.range[1]};`
      }
    });
    if (elements !== "") {
      query += `&specs=(${elements.substring(0, elements.length - 1)})`
    }
  }
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/items/search?${query}`);
    return  response.data as ItemQueryResultResponse
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const searchItemsFromURI = async (searchStr: string): Promise<ItemQueryResultResponse> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/items/search${searchStr}`);
    return  response.data as ItemQueryResultResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const getItemReviews = async (itemId: number): Promise<ReviewResponse[]> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/items/${itemId}/reviews`);
    return  response.data as ReviewResponse[];
  } catch (e: any) {
    throw await maskError(e);
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
    throw await maskError(e);
  }
}

export const deleteMyReview = async (reviewId: number): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.delete(`${inventoryServiceUrl}/reviews/${reviewId}`);
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const createDiscount = async (request: NewDiscountRequest): Promise<DiscountResponse> => {
  try {
    const response = await axiosInstance.post(`${inventoryServiceUrl}/discounts/`, request);
    return  response.data as DiscountResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const getDiscount = async (discountId: number): Promise<DiscountResponse> => {
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/discounts/${discountId}`);
    return  response.data as DiscountResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

interface GetDiscountsBody {
  number_per_page?: number;
  page?: number;
}
export const getDiscounts = async (body: GetDiscountsBody): Promise<DiscountResponse[]> => {
  const size = body.number_per_page ?? 100;
  const offset = body.page ?? 0;
  const paging = `size=${size}&offset=${offset}`;
  try {
    const response = await axiosInstance.get(`${inventoryServiceUrl}/discounts?${paging}`);
    return  response.data as DiscountResponse[];
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const deleteDiscount = async (discountId: number): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.delete(`${inventoryServiceUrl}/discounts/${discountId}`);
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const getMyProfile = async (): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get(`${userServiceUrl}/me`);
    return  response.data as UserResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const updateMyProfile = async (request: UserUpdateRequest): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.put(`${userServiceUrl}/me`, request);
    return  response.data as UserResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const getMyCart = async (): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.get(`${orderServiceUrl}/carts/me`);
    return  response.data as CartResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const updateMyCart = async (request: UpdateCartRequest): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.put(`${orderServiceUrl}/carts/me`, request);
    return  response.data as CartResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const deleteMyCart = async (): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.delete(`${orderServiceUrl}/carts/me`);
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const checkoutMyCart = async (): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.post(`${orderServiceUrl}/carts/me/checkout`);
    return  response.data as OrderResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const getMyOrder = async (orderCode: string): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.get(`${orderServiceUrl}/orders/${orderCode}`);
    return  response.data as OrderResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

export const finishMyOrder = async (orderCode: string): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.post(`${orderServiceUrl}/orders/${orderCode}/finish`);
    return  response.data as OrderResponse;
  } catch (e: any) {
    throw await maskError(e);
  }
}

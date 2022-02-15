export interface User {
  userName: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  userFullName: string;
  id: string;
}

export interface AddressResponse {
  zip: string;
  city: string;
  street: string;
  countryCode: string;
}

export interface UserResponse {
  id: string;
  userName: string;
  userFullName: string;
  email: string;
  address: AddressResponse;
  phone: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResult {
  accessToken: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
  role: string;
}

export interface AddressRequest {
  zip: string;
  city: string;
  street: string;
  countryCode: string;
}

export interface RegisterRequest {
  userName: string;
  password: string;
  confirmPassword: string;
  userFullName: string;
  email: string;
  address: AddressRequest;
  phone: string;
}

export interface AddressUpdateRequest {
  zip: string;
  city: string;
  street: string;
  countryCode: string;
}

export interface UserUpdateRequest {
  address: AddressUpdateRequest;
  phone: string;
  userFullName: string;
}

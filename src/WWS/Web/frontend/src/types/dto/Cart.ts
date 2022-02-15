export interface CartItemResponse {
  itemId: number;
  name: string;
  price: number;
  count: number;
}

export interface CartResponse {
  customerId: string;
  totalPrice: number;
  items: CartItemResponse[];
}

export interface UpdateCartRequest {
  itemId: number;
  count: number;
}

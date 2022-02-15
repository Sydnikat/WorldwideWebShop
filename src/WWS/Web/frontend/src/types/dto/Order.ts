export interface OrderItemResponse {
  id: number;
  itemId: number;
  name: string;
  price: number;
  count: number;
}

export interface OrderResponse {
  id: number;
  orderCode : string;
  customerId: string;
  customerName: string;
  totalPrice: number;
  items: OrderItemResponse[];
  created: string;
  state: string;
  zip: string;
  city: string;
  street: string;
  countryCode: string;
  email: string;
  phone: string;
}

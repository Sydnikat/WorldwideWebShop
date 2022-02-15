export interface NewDiscountRequest {
  value: number;
  endDate: string;
  sendPromotion: boolean | null;
  categoryId: number | null;
  itemIds: number[] | null;
}

export interface DiscountResponse {
  id: number;
  value: number;
  startDate: string;
  endDate: string;
  expired: boolean;
}

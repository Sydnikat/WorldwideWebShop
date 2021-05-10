export interface ItemResponse {
  id: number;
  categoryId: number;
  name: string,
  description: string;
  discountId: number | null;
  rating: number | null;
  ratingCount: number;
  created: string,
  price: number;
  originalPrice: number;
  stock: number;
  lowLevel: number;
}

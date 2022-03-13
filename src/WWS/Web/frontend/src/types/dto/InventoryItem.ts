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
  listOfTechnicalSpecInfo: TechnicalSpecInfoResponse[];
}

export interface TechnicalSpecInfoRequest {
  id: number | null;
  technicalSpecificationId: number;
  value: string;
}

export interface NewItemRequest {
  name: string,
  description: string;
  price: number;
  listOfTechnicalSpecInfo: TechnicalSpecInfoRequest[];
}

export interface UpdateItemRequest {
  description: string;
  stock: number;
  lowLevel: number;
  listOfTechnicalSpecInfo: TechnicalSpecInfoRequest[];
}

export interface ItemQueryResultResponse {
  items: ItemResponse[];
  maxPrice: number;
  minPrice: number;
  count: number;
}

export interface TechnicalSpecInfoResponse {
  id: number;
  technicalSpecificationId: number;
  itemId: number;
  value: string;
}

export interface TechnicalSpecInfoQueryRequest {
  stId: number;
  value?: string;
  range?: number[];
}

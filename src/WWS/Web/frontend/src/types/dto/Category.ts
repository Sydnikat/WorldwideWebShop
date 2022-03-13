export interface CategoryResponse {
  id: number;
  name: string;
  technicalSpecifications: TechnicalSpecificationResponse[]
}

export interface NewTechnicalSpecificationRequest {
  name: string;
  unitOfMeasure: string | null;
  isNumber: boolean;
  isBoolean: boolean;
  isString: boolean;
  isEnumList: boolean;
  listOfEnumNames: string[];
}

export interface TechnicalSpecEnumListItemRequest {
  id: number | null;
  enumName: string;
  technicalSpecificationId: number;
}

export interface TechnicalSpecificationUpdateRequest {
  id: number;
  name: string;
  unitOfMeasure: string | null;
  categoryId: number;
  isNumber: boolean;
  isBoolean: boolean;
  isString: boolean;
  isEnumList: boolean;
  listOfEnumItems: TechnicalSpecEnumListItemRequest[]
}

export interface NewCategoryRequest {
  name: string;
  technicalSpecificationRequests: NewTechnicalSpecificationRequest[];
}

export interface TechnicalSpecEnumListItemResponse {
  id: number;
  enumName: string;
  technicalSpecificationId: number;
}

export interface TechnicalSpecificationResponse {
  id: number;
  name: string;
  unitOfMeasure: string | null;
  categoryId: number;
  isNumber: boolean;
  isBoolean: boolean;
  isString: boolean;
  isEnumList: boolean;
  listOfEnumItems: TechnicalSpecEnumListItemResponse[]
}

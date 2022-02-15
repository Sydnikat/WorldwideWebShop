export interface ReviewResponse {
  id: number;
  itemId: number;
  reviewerName: string;
  reviewerId: string;
  summary: string;
  rating: number;
  created: string;
}

export interface NewReviewRequest {
  reviewerName: string;
  reviewerId: string;
  summary: string;
  rating: number;
}



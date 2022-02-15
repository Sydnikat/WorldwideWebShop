export interface WWSError extends Error {
  message: string;
  statusCode?: number;
}

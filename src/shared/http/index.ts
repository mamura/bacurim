export { createHttpClient } from "./client.ts";
export { ApiError, toApiErrorView } from "./api-error.ts";
export type { ApiErrorKind } from "./api-error.ts";
export type {
  HttpClient,
  HttpClientConfig,
  HttpRequestOptions,
  HttpResponse,
  QueryParameters,
} from "./types.ts";
export type {
  ApiResource,
  ApiCollection,
  ApiPaginatedCollection,
  HealthResponse,
} from "./contracts.ts";
export type { ApiErrorView } from "./api-error.ts";
export type { ProblemDetails } from "./problem-details.ts";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type QueryValue = string | number | boolean | null | undefined;
export type QueryParameters =
  Record<string, QueryValue | readonly QueryValue[]> | URLSearchParams;

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  query?: QueryParameters;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
}

export interface HttpResponse<T> {
  status: number;
  data: T | undefined;
  headers: Headers;
}

export interface HttpClientConfig {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
}

export interface HttpClient {
  request<TResponse, TBody = unknown>(
    path: string,
    options?: HttpRequestOptions<TBody>,
  ): Promise<HttpResponse<TResponse>>;
}

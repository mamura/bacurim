export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type QueryValue = string | number | boolean | null | undefined;
export type QueryParameters =
  Record<string, QueryValue | readonly QueryValue[]> | URLSearchParams;

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  timeoutMs?: number;
  retries?: number;
  query?: QueryParameters;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
}

export interface HttpResponse<T> {
  status: number;
  requestId?: string;
  data: T | undefined;
  headers: Headers;
}

export interface HttpClientConfig {
  sendRequestId?: boolean;
  baseUrl: string;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  getHeaders?: (context: {
    method: HttpMethod;
    url: URL;
    signal: AbortSignal;
  }) => HeadersInit | Promise<HeadersInit>;
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

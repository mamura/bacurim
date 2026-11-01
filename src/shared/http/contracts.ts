export interface ApiResource<T> {
  data: T;
}

export interface ApiCollection<T> {
  data: T[];
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  to: number | null;
  last_page: number;
  path: string;
  per_page: number;
  total: number;
  links: { url: string | null; label: string; active: boolean }[];
}

export interface ApiPaginatedCollection<T> extends ApiCollection<T> {
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface HealthResponse {
  status: "ok";
}

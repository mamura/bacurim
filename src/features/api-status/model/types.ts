import type { ApiErrorView } from "@shared/http/api-error";

export type ApiStatusResult =
  | { ok: true; source: "real" | "mock"; status: "ok"; requestId?: string }
  | { ok: false; source: "real" | "mock"; error: ApiErrorView };

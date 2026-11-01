import "server-only";

export function getApiBaseUrl(): string {
  return process.env.API_BASE_URL ?? "http://api-bacurim.mamura.test/api/v1";
}

export function getApiTimeoutMs(): number {
  const value = process.env.API_TIMEOUT_MS ?? "10000";
  return /^\d+$/.test(value) ? Number(value) : Number.NaN;
}

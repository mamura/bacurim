import "server-only";

export function getApiBaseUrl(): string {
  return process.env.API_BASE_URL ?? "http://api-bacurim.mamura.test/api/v1";
}

import { ApiError } from "../api-error.ts";

export const mockScenarios = [
  "success",
  "validation",
  "unauthenticated",
  "forbidden",
  "not-found",
  "conflict",
  "server-error",
  "network",
  "timeout",
] as const;
export type ApiMockScenario = (typeof mockScenarios)[number];

export function getApiMockScenario(
  env: Readonly<Record<string, string | undefined>>,
): ApiMockScenario | undefined {
  const enabled = env.API_MOCKS_ENABLED ?? "false";
  if (!["true", "false"].includes(enabled)) throw new ApiError("configuration");
  if (enabled === "false") return undefined;
  if (!["development", "test"].includes(env.NODE_ENV ?? ""))
    throw new ApiError("configuration");
  const scenario = env.API_MOCK_SCENARIO ?? "success";
  if (!mockScenarios.includes(scenario as ApiMockScenario))
    throw new ApiError("configuration");
  return scenario as ApiMockScenario;
}

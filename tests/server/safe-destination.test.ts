import { loginErrorMessage } from "@features/authentication/model/login-error";
import { safeDestination } from "@shared/auth/safe-destination";
import { ApiError } from "@shared/http";
import { expect, test } from "vitest";

test.each([
  "https://evil.test",
  "//evil.test",
  "/app/../../evil",
  "/login",
  "/app\\evil",
  "/app/%2f%2fevil",
  "/application",
  "/app\n",
])("rejeita destino inseguro %s", (value) =>
  expect(safeDestination(value)).toBe("/app"),
);
test("preserva destino interno", () =>
  expect(safeDestination("/app/organizations/123?tab=info")).toBe(
    "/app/organizations/123?tab=info",
  ));
test.each([401, 422, 429, 419, 403])(
  "traduz erro de login %s sem expor resposta bruta",
  (status) =>
    expect(loginErrorMessage(new ApiError("http", { status }))).toBeTruthy(),
);

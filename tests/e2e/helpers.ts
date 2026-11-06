import { execFileSync } from "node:child_process";

import type { BrowserContext, Page } from "@playwright/test";
import { expect } from "@playwright/test";
export const API = "http://127.0.0.1:8011";
export const ORG_A = "10000000-0000-4000-8000-000000000001";
export const ORG_B = "10000000-0000-4000-8000-000000000002";
export const PASSWORD = "E2e-only-password!42";
export function fixtures(action = "reset") {
  execFileSync(
    "docker",
    [
      "compose",
      "-p",
      "bacurim-web-e2e",
      "-f",
      "tests/e2e/compose.yml",
      "exec",
      "-T",
      "api",
      "php",
      "/fixtures/fixtures.php",
      action,
    ],
    { stdio: "pipe" },
  );
}
export async function login(page: Page, name = "owner") {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill(name + "@e2e.test");
  await page.getByLabel("Senha", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
}
export async function apiRequest(
  context: BrowserContext,
  path: string,
  method = "GET",
  data?: unknown,
) {
  const token = (await context.cookies(API)).find(
    (cookie) => cookie.name === "XSRF-TOKEN",
  );
  return context.request.fetch(API + path, {
    method,
    data,
    headers: {
      Origin: "http://127.0.0.1:3100",
      Accept: "application/json",
      ...(token ? { "X-XSRF-TOKEN": decodeURIComponent(token.value) } : {}),
    },
  });
}
export async function expectHome(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Bem-vindo ao seu espaço" }),
  ).toBeVisible();
}

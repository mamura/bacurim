import { expect, test } from "@playwright/test";

import { API, apiRequest, expectHome, fixtures, login } from "../helpers";
test.beforeEach(() => fixtures());
test("contrato real: CSRF, cookies, identidade, organizações e logout", async ({
  page,
  context,
}) => {
  const csrf = page.waitForResponse(
    (response) => response.url() === API + "/sanctum/csrf-cookie",
  );
  await login(page);
  expect((await csrf).status()).toBe(204);
  await expectHome(page);
  const cookies = await context.cookies(API);
  expect(
    cookies.find((cookie) => cookie.name === "bacurim_e2e_session")?.httpOnly,
  ).toBe(true);
  const me = await apiRequest(context, "/api/v1/auth/me");
  expect(me.status()).toBe(200);
  expect((await me.json()).data).toMatchObject({
    email: "owner@e2e.test",
    profile: "standard",
  });
  const organizations = await apiRequest(context, "/api/v1/auth/organizations");
  expect((await organizations.json()).data[0]).toMatchObject({
    name: "Empresa Alfa",
    role: "owner",
  });
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await expect(page).toHaveURL(/\/login/);
  expect((await apiRequest(context, "/api/v1/auth/me")).status()).toBe(401);
});

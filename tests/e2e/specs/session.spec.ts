import { expect, test } from "@playwright/test";

import { API, expectHome, fixtures, login, ORG_A } from "../helpers";
test.beforeEach(() => fixtures());
test("acesso privado anônimo preserva destino sem mostrar conteúdo", async ({
  page,
}) => {
  await page.goto("/app/organizations/" + ORG_A);
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(
    page.getByRole("heading", { name: "Bem-vindo ao seu espaço" }),
  ).not.toBeVisible();
  await page.getByLabel("E-mail", { exact: true }).fill("owner@e2e.test");
  await page.getByLabel("Senha", { exact: true }).fill("E2e-only-password!42");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expectHome(page);
});
test("sessão é restaurada e navega entre páginas privadas", async ({
  page,
}) => {
  await login(page);
  await expectHome(page);
  await page.reload();
  await expectHome(page);
  if (
    !(await page
      .getByRole("link", { name: "Meu acesso", exact: true })
      .isVisible())
  )
    await page.getByRole("button", { name: "Abrir navegação" }).click();
  await page.getByRole("link", { name: "Meu acesso", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Meu acesso" })).toBeVisible();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
for (const account of ["missing", "inactive"])
  test(
    account + " recebe mensagem genérica de credenciais inválidas",
    async ({ page }) => {
      await login(page, account);
      await expect(
        page.getByRole("form", { name: "Entrar" }).getByRole("alert"),
      ).toHaveText("E-mail ou senha inválidos.");
      await expect(page.getByLabel("Senha", { exact: true })).toHaveValue("");
      await expect(page).toHaveURL(/\/login/);
    },
  );
test("sessão expirada volta ao login e conteúdo anterior não permanece", async ({
  page,
}) => {
  await login(page);
  await expectHome(page);
  fixtures("expire");
  await page.reload();
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole("heading", { name: "Bem-vindo ao seu espaço" }),
  ).not.toBeVisible();
});
test("falha de conexão no login permite nova tentativa", async ({ page }) => {
  await page.route(API + "/api/v1/auth/login", (route) =>
    route.abort("connectionfailed"),
  );
  await login(page);
  await expect(
    page.getByRole("form", { name: "Entrar" }).getByRole("alert"),
  ).toContainText("Não foi possível conectar");
  await expect(
    page.getByRole("button", { name: "Entrar", exact: true }),
  ).toBeEnabled();
});
test("falha transitória de revalidação não declara logout", async ({
  page,
}) => {
  await login(page);
  await expectHome(page);
  await page.route(API + "/api/v1/auth/me", (route) =>
    route.abort("connectionfailed"),
  );
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(
    page.getByRole("button", { name: "Tentar novamente" }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(/\/login/);
  await page.unroute(API + "/api/v1/auth/me");
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expectHome(page);
});
test("falha de rede no logout exige revalidação sem confirmar encerramento", async ({
  page,
}) => {
  await login(page);
  await expectHome(page);
  await page.route(API + "/api/v1/auth/logout", (route) =>
    route.abort("connectionfailed"),
  );
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Tentar novamente" }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(/\/login/);
  await page.unroute(API + "/api/v1/auth/logout");
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expectHome(page);
});
test("limite real de tentativas gera feedback 429", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill("owner@e2e.test");
  for (let index = 0; index < 6; index++) {
    const response = page.waitForResponse(API + "/api/v1/auth/login");
    await page.getByLabel("Senha", { exact: true }).fill("incorrect-password");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    expect((await response).status()).toBe(index < 5 ? 401 : 429);
  }
  await expect(
    page.getByRole("form", { name: "Entrar" }).getByRole("alert"),
  ).toContainText("Muitas tentativas");
});

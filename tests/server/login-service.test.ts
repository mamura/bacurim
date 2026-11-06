import { login } from "@features/authentication/services/login";
import { readXsrfCookie } from "@shared/http/browser";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => vi.unstubAllGlobals());

test("inicializa CSRF antes do login e preserva a senha, com cookies e sem header fora do CORS", async () => {
  vi.stubGlobal("document", { cookie: "XSRF-TOKEN=encoded%3Dtoken" });
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
    .mockResolvedValueOnce(
      Response.json({
        data: {
          public_id: "uuid",
          name: "Ana",
          email: "ana@example.test",
          profile: "consultant",
          status: "active",
          email_verified_at: null,
        },
      }),
    );
  vi.stubGlobal("fetch", fetch);
  const user = await login({ email: "ana@example.test", password: " spaces " });
  expect(user.profile).toBe("consultant");
  expect(String(fetch.mock.calls[0][0])).toContain("/sanctum/csrf-cookie");
  const init = fetch.mock.calls[1][1];
  expect(init.credentials).toBe("include");
  expect(init.headers.get("X-XSRF-TOKEN")).toBe("encoded=token");
  expect(init.headers.has("X-Request-ID")).toBe(false);
  expect(JSON.parse(init.body).password).toBe(" spaces ");
});
test("não envia credenciais se o bootstrap CSRF falha", async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 403 }));
  vi.stubGlobal("fetch", fetch);
  await expect(
    login({ email: "ana@example.test", password: "secret" }),
  ).rejects.toMatchObject({ status: 403 });
  expect(fetch).toHaveBeenCalledOnce();
  expect(readXsrfCookie("XSRF-TOKEN=%broken")).toBeUndefined();
});

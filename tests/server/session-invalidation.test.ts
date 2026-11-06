import {
  advanceAuthEpoch,
  authenticatedRequest,
  subscribeUnauthorized,
} from "@shared/auth/authenticated-request";
import type { AuthUser } from "@shared/auth/contracts";
import { SessionStore } from "@shared/auth/session-store";
import { expect, test, vi } from "vitest";
const user: AuthUser = {
  public_id: "uuid",
  name: "Ana",
  email: "ana@example.test",
  profile: "standard",
  status: "active",
  email_verified_at: null,
};
test("logout confirmado limpa identidade; rede não equivale a confirmação", async () => {
  vi.stubGlobal("document", { cookie: "XSRF-TOKEN=token" });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
  );
  const store = new SessionStore(async () => user);
  store.acceptUser(user);
  await store.logout();
  expect(store.getSnapshot()).toMatchObject({
    status: "unauthenticated",
    user: null,
  });
  store.acceptUser(user);
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
  await store.logout();
  expect(store.getSnapshot().status).toBe("error");
});
test.each([401, 403])(
  "resposta %s invalida somente quando é 401",
  async (status) => {
    const invalidate = vi.fn();
    const unsubscribe = subscribeUnauthorized(invalidate);
    try {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response(null, { status })),
      );
      await expect(
        authenticatedRequest("api/v1/auth/me"),
      ).rejects.toMatchObject({ status });
      expect(invalidate).toHaveBeenCalledTimes(status === 401 ? 1 : 0);
    } finally {
      unsubscribe();
    }
  },
);
test("401 tardio não encerra uma nova sessão", async () => {
  let finish: (response: Response) => void = () => {};
  vi.stubGlobal(
    "fetch",
    () =>
      new Promise<Response>((resolve) => {
        finish = resolve;
      }),
  );
  const invalidate = vi.fn();
  const unsubscribe = subscribeUnauthorized(invalidate);
  try {
    const request = authenticatedRequest("api/v1/auth/me");
    await vi.waitFor(() => expect(finish).not.toBeUndefined());
    await new Promise((resolve) => setTimeout(resolve, 0));
    advanceAuthEpoch();
    finish(new Response(null, { status: 401 }));
    await expect(request).rejects.toMatchObject({ status: 401 });
    expect(invalidate).not.toHaveBeenCalled();
  } finally {
    unsubscribe();
  }
});

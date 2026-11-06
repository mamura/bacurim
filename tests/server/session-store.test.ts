import type { AuthUser } from "@shared/auth/contracts";
import { SessionStore } from "@shared/auth/session-store";
import { ApiError } from "@shared/http";
import { expect, test, vi } from "vitest";
const user: AuthUser = {
  public_id: "uuid",
  name: "Ana",
  email: "ana@example.test",
  profile: "standard",
  status: "active",
  email_verified_at: null,
};
test("coalesce restauração e aceita identidade", async () => {
  const load = vi.fn().mockResolvedValue(user);
  const store = new SessionStore(load);
  await Promise.all([store.refresh(), store.refresh()]);
  expect(load).toHaveBeenCalledOnce();
  expect(store.getSnapshot().status).toBe("authenticated");
});
test("resposta antiga não restaura sessão invalidada", async () => {
  let resolve: (user: AuthUser) => void = () => {};
  const store = new SessionStore(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const request = store.refresh();
  store.invalidate();
  resolve(user);
  await request;
  expect(store.getSnapshot().status).toBe("unauthenticated");
});
test.each([
  [401, "unauthenticated"],
  [403, "error"],
  [undefined, "error"],
])("distingue falha %s de invalidação", async (status, expected) => {
  const store = new SessionStore(async () => {
    throw new ApiError(status ? "http" : "network", {
      status: status as number | undefined,
    });
  });
  await store.refresh();
  expect(store.getSnapshot().status).toBe(expected);
});

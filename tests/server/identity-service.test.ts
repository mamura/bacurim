import { getAuthenticatedUser } from "@shared/auth/services";
import { expect, test, vi } from "vitest";
test.each(["standard", "consultant"])(
  "recupera identidade %s e envia cookies",
  async (profile) => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        Response.json({
          data: {
            public_id: "uuid",
            name: "Ana",
            email: "ana@example.test",
            profile,
            status: "active",
            email_verified_at: null,
          },
        }),
      );
    vi.stubGlobal("fetch", fetch);
    expect((await getAuthenticatedUser()).profile).toBe(profile);
    expect(fetch.mock.calls[0][1].credentials).toBe("include");
  },
);
test("não aceita contrato presumido sem perfil", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ data: { name: "Ana" } })),
  );
  await expect(getAuthenticatedUser()).rejects.toMatchObject({
    kind: "invalid-response",
  });
});

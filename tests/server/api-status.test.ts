import { getApiStatus } from "@features/api-status/server";
import { describe, expect, test } from "vitest";

import { mockApi } from "../helpers/mock-api";

describe("serviço de status com cliente HTTP real e transporte interceptado", () => {
  test("valida o contrato e usa o endpoint configurado", async () => {
    const fetch = mockApi();
    expect(await getApiStatus()).toMatchObject({
      ok: true,
      status: "ok",
      source: "real",
    });
    expect(String(fetch.mock.calls[0][0])).toBe(
      "https://api.example.test/api/v1/health",
    );
  });

  test.each([
    ["validation", "http", 422],
    ["unauthenticated", "http", 401],
    ["forbidden", "http", 403],
    ["network", "network", undefined],
    ["timeout", "timeout", undefined],
  ] as const)(
    "%s produz erro seguro e serializável",
    async (scenario, kind, status) => {
      mockApi(scenario);
      const result = await getApiStatus();
      expect(result).toMatchObject({
        ok: false,
        source: "real",
        error: { kind },
      });
      if (result.ok) throw new Error("Esperava falha");
      expect(result.error.status).toBe(status);
      expect(result.error.message).not.toMatch(
        /Simulated|TypeError|Mock API problem/,
      );
      expect(JSON.parse(JSON.stringify(result))).toEqual(result);
      if (status === 422)
        expect(result.error.fieldErrors.name).toEqual(["Informe o nome."]);
    },
  );

  test("rejeita sucesso HTTP com contrato inválido", async () => {
    const fetch = mockApi();
    fetch.mockResolvedValue(Response.json({ status: "unexpected" }));
    expect(await getApiStatus()).toMatchObject({
      ok: false,
      error: { kind: "invalid-response" },
    });
  });
});

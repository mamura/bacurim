import type { ApiMockScenario } from "./mock-policy.ts";

const example = {
  id: "9007199254740993",
  name: "Exemplo técnico",
  amount: "1234.56",
  currency: "BRL",
};

function problem(status: number, instance: string) {
  return Response.json(
    {
      type:
        status === 422
          ? "urn:bacurim:problem:validation_failed"
          : "about:blank",
      title: "Mock API problem",
      status,
      instance,
      detail: "Resposta técnica simulada.",
      ...(status === 422
        ? {
            code: "validation_failed",
            errors: {
              name: ["Informe o nome."],
              "items.0.label": ["Informe a descrição."],
            },
          }
        : {}),
      ...(status === 409 ? { code: "example.state_conflict" } : {}),
    },
    { status, headers: { "Content-Type": "application/problem+json" } },
  );
}

export function createApiMockFetch(
  scenario: ApiMockScenario = "success",
): typeof globalThis.fetch {
  return async (input, init = {}) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const method = init.method ?? "GET";
    if (scenario === "network")
      throw new TypeError("Simulated connection failure.");
    if (scenario === "timeout") {
      return new Promise<Response>((_, reject) => {
        const signal = init.signal;
        const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
        if (signal?.aborted) onAbort();
        else signal?.addEventListener("abort", onAbort, { once: true });
      });
    }
    const scenarioStatuses: Partial<Record<ApiMockScenario, number>> = {
      validation: 422, unauthenticated: 401, forbidden: 403, "not-found": 404,
      conflict: 409, "server-error": 500,
    };
    const status = scenarioStatuses[scenario];
    if (status) return problem(status, url.pathname);
    if (url.pathname.endsWith("/health")) {
      if (method === "GET") return Response.json({ status: "ok" });
      const response = problem(405, url.pathname);
      response.headers.set("Allow", "GET, HEAD");
      return response;
    }
    const collection = url.pathname.endsWith("/examples");
    const resource = url.pathname.endsWith("/examples/" + example.id);
    if (!collection && !resource) return problem(404, url.pathname);
    if (method === "DELETE") return new Response(null, { status: 204 });
    if (method === "POST")
      return Response.json(
        { data: { ...example } },
        { status: 201, headers: { Location: url.pathname + "/" + example.id } },
      );
    if (method === "GET" && collection) {
      if (url.searchParams.has("page")) {
        return Response.json({
          data: [{ ...example }],
          links: {
            first: url.pathname + "?page=1",
            last: url.pathname + "?page=1",
            prev: null,
            next: null,
          },
          meta: {
            current_page: 1,
            from: 1,
            to: 1,
            last_page: 1,
            path: url.pathname,
            per_page: 20,
            total: 1,
            links: [
              { url: null, label: "Previous", active: false },
              { url: url.pathname + "?page=1", label: "1", active: true },
              { url: null, label: "Next", active: false },
            ],
          },
        });
      }
      return Response.json({ data: [{ ...example }] });
    }
    return Response.json({ data: { ...example } });
  };
}

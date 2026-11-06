import type { AuthorizedOrganization } from "@shared/organizations/contracts";
import { OrganizationStore } from "@shared/organizations/organization-store";
import { OrganizationRequestScope } from "@shared/organizations/request-scope";
import { expect, test, vi } from "vitest";

const org: AuthorizedOrganization = {
  public_id: "org-1",
  name: "Empresa",
  role: "viewer",
  membership_public_id: "m1",
};
test("dispose impede resposta antiga de repovoar organizações", async () => {
  let finish: (organizations: AuthorizedOrganization[]) => void = () => {};
  const store = new OrganizationStore(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const request = store.refresh();
  store.dispose();
  finish([org]);
  await request;
  expect(store.getSnapshot().organizations).toEqual([]);
});
test("revalidação remove vínculo revogado", async () => {
  const load = vi.fn().mockResolvedValueOnce([org]).mockResolvedValueOnce([]);
  const store = new OrganizationStore(load);
  await store.refresh();
  expect(store.getSnapshot().organizations).toEqual([org]);
  await store.refresh();
  expect(store.getSnapshot().organizations).toEqual([]);
});
test.each([403, 404])(
  "erro empresarial %s exige revalidação, sem logout",
  async (status) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status })),
    );
    const revalidate = vi.fn();
    await expect(
      new OrganizationRequestScope("org-1", revalidate).request("members"),
    ).rejects.toMatchObject({ status });
    expect(revalidate).toHaveBeenCalledOnce();
  },
);
test("requisição encerrada não pode executar ou entregar dados", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  const scope = new OrganizationRequestScope("org-1");
  scope.close();
  await expect(scope.request("members")).rejects.toMatchObject({
    kind: "cancelled",
  });
  expect(fetch).not.toHaveBeenCalled();
});

test("revalidação substitui papel e não preserva permissões do vínculo antigo", async () => {
  const load = vi
    .fn()
    .mockResolvedValueOnce([{ ...org, role: "admin" }])
    .mockResolvedValueOnce([{ ...org, role: "viewer" }]);
  const store = new OrganizationStore(load);
  await store.refresh();
  expect(store.getSnapshot().organizations[0].role).toBe("admin");
  const request = store.refresh();
  expect(store.getSnapshot().organizations).toEqual([]);
  await request;
  expect(store.getSnapshot().organizations[0].role).toBe("viewer");
  store.dispose();
  expect(store.getSnapshot().organizations).toEqual([]);
});

test("resposta em trânsito de um escopo encerrado não entrega dados após reativação", async () => {
  let finish: (response: Response) => void = () => {};
  let notify: () => void = () => {};
  const started = new Promise<void>((resolve) => {
    notify = resolve;
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      notify();
      return new Promise<Response>((resolve) => {
        finish = resolve;
      });
    }),
  );
  const scope = new OrganizationRequestScope("org-1");
  const request = scope.request("members");
  const assertion = expect(request).rejects.toMatchObject({
    kind: "cancelled",
  });
  await started;
  scope.close();
  scope.activate();
  finish(Response.json({ data: ["old-private-data"] }));
  await assertion;
  scope.close();
});

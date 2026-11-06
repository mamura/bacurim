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

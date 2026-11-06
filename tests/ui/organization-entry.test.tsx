import { OrganizationEntry } from "@features/organizations";
import type { UserProfile } from "@shared/auth/contracts";
import { SessionProvider } from "@shared/auth/session-provider";
import { SessionStore } from "@shared/auth/session-store";
import { OrganizationProvider } from "@shared/organizations/organization-provider";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
const navigation = vi.hoisted(() => ({ replace: vi.fn(), push: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
  usePathname: () => "/app",
}));
test.each([
  ["standard", 0],
  ["standard", 1],
  ["consultant", 0],
  ["consultant", 1],
  ["consultant", 2],
] as const)(
  "%s com %s organizações segue jornada correta",
  async (profile: UserProfile, count: number) => {
    const organizations = Array.from({ length: count }, (_, index) => ({
      public_id: "org-" + index,
      name: "Empresa " + index,
      role: "viewer",
      membership_public_id: "m-" + index,
    }));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ data: organizations })),
    );
    const store = new SessionStore();
    store.acceptUser({
      public_id: "user",
      name: "Ana",
      email: "ana@example.test",
      status: "active",
      profile,
      email_verified_at: null,
    });
    render(
      <SessionProvider store={store}>
        <OrganizationProvider>
          <OrganizationEntry />
        </OrganizationProvider>
      </SessionProvider>,
    );
    if (count === 0)
      expect(
        await screen.findByText("Nenhuma empresa disponível"),
      ).toBeInTheDocument();
    else if (count === 1) {
      await waitFor(() =>
        expect(navigation.replace).toHaveBeenCalledWith(
          "/app/organizations/org-0",
        ),
      );
      expect(screen.queryByText("Escolha uma empresa")).not.toBeInTheDocument();
    } else
      expect(
        await screen.findByRole("list", { name: "Empresas autorizadas" }),
      ).toBeInTheDocument();
  },
);

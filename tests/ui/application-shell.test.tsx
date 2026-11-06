import { ApplicationShell } from "@features/application-shell";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
const state = vi.hoisted(() => ({
  canSwitch: true,
  push: vi.fn(),
  logout: vi.fn(),
  active: {
    public_id: "org-1",
    name: "Empresa Um",
    role: "owner",
    membership_public_id: "m1",
  },
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/app/organizations/org-1",
  useRouter: () => ({ push: state.push }),
}));
vi.mock("@shared/organizations/active-organization", () => ({
  useActiveOrganization: () => ({
    active: state.active,
    canSwitch: state.canSwitch,
  }),
}));
vi.mock("@shared/auth/session-provider", () => ({
  useSession: () => ({
    status: "authenticated",
    user: { name: "Ana" },
    store: { logout: state.logout },
  }),
}));
test("integra navegação, recolhimento e ações essenciais", async () => {
  render(
    <ApplicationShell>
      <h1>Conteúdo</h1>
    </ApplicationShell>,
  );
  const user = userEvent.setup();
  expect(screen.getByText("Empresa Um")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await user.click(screen.getByRole("button", { name: "Collapse navigation" }));
  expect(
    screen.getByRole("button", { name: "Expand navigation" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "Meu acesso" }));
  expect(state.push).toHaveBeenCalledWith("/app/organizations/org-1/access");
  await user.click(screen.getByRole("button", { name: "Sair" }));
  expect(state.logout).toHaveBeenCalledOnce();
});
test("menu móvel abre, fecha com Escape e devolve foco ao controle", async () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  render(
    <ApplicationShell>
      <h1>Conteúdo</h1>
    </ApplicationShell>,
  );
  const user = userEvent.setup();
  const open = screen.getByRole("button", { name: "Abrir navegação" });
  await user.click(open);
  const dialog = screen.getByRole("dialog", { name: "Mobile navigation" });
  expect(
    within(dialog).getByRole("link", { name: "Meu acesso" }),
  ).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(open).toHaveFocus();
});

test.each(["owner", "admin", "member", "viewer"])(
  "papel %s preserva somente a navegação implementada",
  (role) => {
    state.active.role = role;
    state.canSwitch = false;
    render(
      <ApplicationShell>
        <h1>Conteúdo</h1>
      </ApplicationShell>,
    );
    expect(screen.getByRole("link", { name: "Início" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Trocar empresa" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /transações|relatórios|membros/i }),
    ).not.toBeInTheDocument();
    state.active.role = "owner";
    state.canSwitch = true;
  },
);

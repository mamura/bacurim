import { AccessGate, ProtectedAction } from "@shared/access/access-gate";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
const context = vi.hoisted(() => ({ role: "viewer", status: "ready" }));
vi.mock("@shared/organizations/active-organization", () => ({
  useActiveOrganization: () => ({
    status: context.status,
    active: {
      public_id: "org",
      name: "Empresa",
      membership_public_id: "m",
      role: context.role,
    },
  }),
}));
test("oculta ações bloqueadas e impede clique em ação desabilitada", async () => {
  const click = vi.fn();
  render(
    <>
      <AccessGate permission="members.manage">
        <p>Gerenciar membros</p>
      </AccessGate>
      <ProtectedAction permission="financial.write" onClick={click}>
        Salvar
      </ProtectedAction>
    </>,
  );
  expect(screen.queryByText("Gerenciar membros")).not.toBeInTheDocument();
  const save = screen.getByRole("button", { name: "Salvar" });
  expect(save).toBeDisabled();
  await userEvent.click(save);
  expect(click).not.toHaveBeenCalled();
});
test("carregamento não concede acesso mesmo com papel conhecido", () => {
  context.status = "loading";
  context.role = "owner";
  render(
    <AccessGate permission="financial.read">
      <p>Dados</p>
    </AccessGate>,
  );
  expect(screen.queryByText("Dados")).not.toBeInTheDocument();
  context.status = "ready";
  context.role = "viewer";
});

import { OrganizationPicker } from "@features/organizations/components/organization-picker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
test("seleção por teclado usa somente identificadores autorizados", async () => {
  const select = vi.fn();
  render(
    <OrganizationPicker
      organizations={[
        {
          public_id: "org-1",
          name: "Empresa Um",
          role: "viewer",
          membership_public_id: "m-1",
        },
      ]}
      onSelect={select}
    />,
  );
  const user = userEvent.setup();
  await user.tab();
  expect(
    screen.getByRole("button", { name: "Acessar Empresa Um" }),
  ).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(select).toHaveBeenCalledWith("org-1");
  expect(screen.queryByText("Empresa Dois")).not.toBeInTheDocument();
});

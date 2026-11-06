import { LoginForm } from "@features/authentication";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

test("valida campos e permite mostrar a senha sem enviá-la", async () => {
  const authenticate = vi.fn();
  const user = userEvent.setup();
  render(<LoginForm authenticate={authenticate} />);
  await user.click(screen.getByRole("button", { name: "Entrar" }));
  expect(screen.getByLabelText("E-mail")).toHaveFocus();
  expect(screen.getByText("Informe sua senha.")).toBeInTheDocument();
  await user.type(screen.getByLabelText("Senha"), " senha com espaços ");
  await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
  expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "text");
  expect(authenticate).not.toHaveBeenCalled();
});

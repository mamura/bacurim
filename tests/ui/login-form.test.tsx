import { LoginForm } from "@features/authentication";
import { ApiError } from "@shared/http";
import { act, render, screen } from "@testing-library/react";
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

test("bloqueia envios duplicados, aceita teclado e limpa a senha após sucesso", async () => {
  let finish: () => void = () => {};
  const authenticate = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  const success = vi.fn();
  const user = userEvent.setup();
  render(<LoginForm authenticate={authenticate} onSuccess={success} />);
  await user.type(screen.getByLabelText("E-mail"), "ana@example.test");
  await user.type(screen.getByLabelText("Senha"), "secret{Enter}");
  expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled();
  expect(authenticate).toHaveBeenCalledOnce();
  await act(async () => finish());
  expect(success).toHaveBeenCalledOnce();
  expect(screen.getByLabelText("Senha")).toHaveValue("");
});

test("falha de autenticação mantém e-mail e apresenta feedback acessível", async () => {
  const user = userEvent.setup();
  render(
    <LoginForm
      authenticate={async () => {
        throw new ApiError("http", { status: 401 });
      }}
    />,
  );
  await user.type(screen.getByLabelText("E-mail"), "ana@example.test");
  await user.type(screen.getByLabelText("Senha"), "secret");
  await user.click(screen.getByRole("button", { name: "Entrar" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "E-mail ou senha inválidos.",
  );
  expect(screen.getByLabelText("E-mail")).toHaveValue("ana@example.test");
  expect(screen.getByLabelText("Senha")).toHaveValue("");
});

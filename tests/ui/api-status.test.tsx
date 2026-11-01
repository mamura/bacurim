import { ApiStatus } from "@features/api-status";
import { ApiError, toApiErrorView } from "@shared/http";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("apresenta saúde validada, origem e identificador da requisição", () => {
  render(
    <ApiStatus
      result={{ ok: true, source: "real", status: "ok", requestId: "req-123" }}
    />,
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "API respondeu corretamente",
  );
  expect(screen.getByText("Fonte: API real")).toBeInTheDocument();
  expect(screen.getByText(/req-123/)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Executar nova leitura" }),
  ).toHaveAttribute("href", "/dev/http");
});

test("apresenta erro seguro com campos inválidos e origem simulada", () => {
  const error = toApiErrorView(
    new ApiError("http", {
      status: 422,
      fieldErrors: { name: ["Informe o nome."] },
    }),
  );
  render(<ApiStatus result={{ ok: false, source: "mock", error }} />);
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível concluir a leitura",
  );
  expect(screen.getByText("name: Informe o nome.")).toBeInTheDocument();
  expect(screen.getByText(/HTTP 422/)).toBeInTheDocument();
  expect(screen.getByText("Fonte: mock explícito")).toBeInTheDocument();
});

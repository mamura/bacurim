import { PageEmptyState } from "@shared/ui/page-empty-state";
import { PageErrorState } from "@shared/ui/page-error-state";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Link from "next/link";
import { expect, test, vi } from "vitest";

test("estado vazio apresenta as props e permite ação complementar", () => {
  render(
    <PageEmptyState
      title="Sem registros"
      description="Crie o primeiro registro."
    >
      <a href="/novo">Criar registro</a>
    </PageEmptyState>,
  );
  expect(screen.getByText("Sem registros")).toBeInTheDocument();
  expect(screen.getByText("Crie o primeiro registro.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Criar registro" })).toHaveAttribute(
    "href",
    "/novo",
  );
});

test("estado de erro comunica a falha e executa recuperação", async () => {
  const retry = vi.fn();
  const user = userEvent.setup();
  render(
    <PageErrorState onRetry={retry}>
      <Link href="/">Voltar</Link>
    </PageErrorState>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível carregar esta página",
  );
  await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
  expect(retry).toHaveBeenCalledOnce();
  expect(screen.getByRole("link", { name: "Voltar" })).toBeInTheDocument();
});

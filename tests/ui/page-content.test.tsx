import { PageContent } from "@shared/ui/page-content";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
test("página compõe título descrição ações e conteúdo sem outro main", () => {
  render(
    <PageContent
      title="Página"
      description="Descrição"
      actions={<button>Ação</button>}
    >
      <p>Conteúdo</p>
    </PageContent>,
  );
  expect(
    screen.getByRole("heading", { name: "Página", level: 1 }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ação" })).toBeInTheDocument();
  expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  expect(screen.queryByRole("main")).not.toBeInTheDocument();
});

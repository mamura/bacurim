import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PageLoading } from "@shared/ui/page-loading";

test("comunica carregamento de forma acessível com os componentes reais da UI", () => {
  render(<PageLoading />);
  expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  expect(screen.getByText("Carregando página...")).toBeInTheDocument();
});

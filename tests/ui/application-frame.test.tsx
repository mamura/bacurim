import { ApplicationFrame } from "@features/application-shell";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
test("compõe header, navegação e uma região principal com children", () => {
  render(
    <ApplicationFrame
      header={<header>Identidade</header>}
      navigation={<nav>Menu</nav>}
    >
      <h1>Página autenticada</h1>
    </ApplicationFrame>,
  );
  expect(screen.getByRole("banner")).toHaveTextContent("Identidade");
  expect(screen.getByRole("main")).toHaveTextContent("Página autenticada");
  expect(screen.getAllByRole("main")).toHaveLength(1);
});

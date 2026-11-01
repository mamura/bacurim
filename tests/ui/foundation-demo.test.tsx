import { FoundationDemo } from "@features/foundation-demo";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

const items = [
  { id: "1", title: "Roteamento", description: "Organiza as páginas" },
  { id: "2", title: "Estado", description: "Interação local" },
];

test("filtra pela descrição e recupera a lista pela ação de limpar", async () => {
  const user = userEvent.setup();
  render(<FoundationDemo items={items} />);
  expect(screen.getByRole("button", { name: "Limpar filtro" })).toBeDisabled();
  await user.type(
    screen.getByRole("textbox", { name: "Filtrar itens" }),
    "LOCAL",
  );
  expect(screen.getByRole("status")).toHaveTextContent("1 de 2 itens");
  expect(screen.queryByText("Roteamento")).not.toBeInTheDocument();
  expect(screen.getByText("Estado")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Limpar filtro" }));
  expect(screen.getByRole("status")).toHaveTextContent("2 de 2 itens");
  expect(screen.getByRole("textbox")).toHaveValue("");
});

test("oferece recuperação quando o filtro não encontra resultados", async () => {
  const user = userEvent.setup();
  render(<FoundationDemo items={items} />);
  await user.type(
    screen.getByRole("textbox", { name: "Filtrar itens" }),
    "ausente",
  );
  expect(
    screen.getByText("Nenhum resultado para o filtro"),
  ).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Mostrar todos os itens" }),
  );
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("2 de 2 itens");
});

test("distingue lista vazia de um filtro sem resultados", () => {
  render(<FoundationDemo items={[]} />);
  expect(screen.getByText("Nenhum item de exemplo")).toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

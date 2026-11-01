import "server-only";

import type { FoundationItem } from "../model/types";

const items: readonly FoundationItem[] = [
  {
    id: "routing",
    title: "Roteamento",
    description: "A rota compõe a feature por sua entrada pública.",
  },
  {
    id: "data",
    title: "Leitura no servidor",
    description: "O serviço entrega um modelo simples de apresentação.",
  },
  {
    id: "state",
    title: "Estado local",
    description: "O filtro é local e a lista visível é derivada dos dados.",
  },
];

export async function getFoundationItems(
  rawScenario: unknown,
): Promise<FoundationItem[]> {
  // These scenarios belong only to this isolated technical example.
  const scenario = typeof rawScenario === "string" ? rawScenario : "ready";
  if (scenario === "error")
    throw new Error("Architecture example: simulated read failure.");
  if (scenario === "loading")
    await new Promise((resolve) => setTimeout(resolve, 900));
  if (scenario === "empty") return [];
  return items.map((item) => ({ ...item }));
}

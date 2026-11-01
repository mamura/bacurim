import { useFoundationFilter } from "@features/foundation-demo/hooks/use-foundation-filter";
import { act, renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

test("normaliza espaços e caixa e recalcula ao receber novos itens", () => {
  const item = { id: "1", title: "Ação", description: "Interação local" };
  const { result, rerender } = renderHook(
    ({ items }) => useFoundationFilter(items),
    {
      initialProps: { items: [item] },
    },
  );
  act(() => result.current.setQuery("  AÇÃO  "));
  expect(result.current.visibleItems).toEqual([item]);
  rerender({ items: [{ id: "2", title: "Novo", description: "Outro" }] });
  expect(result.current.visibleItems).toEqual([]);
  act(() => result.current.clearFilter());
  expect(result.current.query).toBe("");
  expect(result.current.visibleItems.map((item) => item.id)).toEqual(["2"]);
});

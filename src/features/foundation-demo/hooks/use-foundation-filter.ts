"use client";

import { useMemo, useState } from "react";

import type { FoundationItem } from "../model/types";

export function useFoundationFilter(items: readonly FoundationItem[]) {
  const [query, setQuery] = useState("");
  const visibleItems = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return items.filter((item) =>
      (item.title + " " + item.description)
        .toLocaleLowerCase("pt-BR")
        .includes(term),
    );
  }, [items, query]);

  return { query, setQuery, visibleItems, clearFilter: () => setQuery("") };
}

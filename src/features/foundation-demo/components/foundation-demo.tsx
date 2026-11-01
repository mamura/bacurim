"use client";

import { useId } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "bacurim-ui";

import { PageEmptyState } from "@shared/ui/page-empty-state";

import { useFoundationFilter } from "../hooks/use-foundation-filter";
import type { FoundationItem } from "../model/types";

export function FoundationDemo({
  items,
}: {
  items: readonly FoundationItem[];
}) {
  const inputId = useId();
  const { query, setQuery, visibleItems, clearFilter } =
    useFoundationFilter(items);

  return (
    <Card>
      <CardHeader>
        <CardTitle aria-level={2}>
          Dados do servidor, interação no navegador
        </CardTitle>
        <CardDescription>
          Exemplo técnico sem API, persistência ou regras financeiras.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor={inputId} className="body-sm font-medium">
              Filtrar itens
            </label>
            <Input
              id={inputId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: roteamento"
            />
          </div>
          <Button variant="outline" disabled={!query} onClick={clearFilter}>
            Limpar filtro
          </Button>
        </div>
        <p role="status" className="body-sm text-text-secondary">
          {visibleItems.length} de {items.length} itens
        </p>
        {items.length === 0 ? (
          <PageEmptyState
            title="Nenhum item de exemplo"
            description="A leitura terminou com sucesso, mas não retornou itens. Use o cenário Normal para restaurar o exemplo."
          />
        ) : visibleItems.length === 0 ? (
          <PageEmptyState
            title="Nenhum resultado para o filtro"
            description="Altere o texto ou limpe o filtro para ver os itens."
          >
            <Button onClick={clearFilter}>Mostrar todos os itens</Button>
          </PageEmptyState>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                Modelos simples preparados no serviço da própria feature.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Responsabilidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="soft">{item.title}</Badge>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

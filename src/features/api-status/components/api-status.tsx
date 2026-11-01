import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "bacurim-ui";

import type { ApiStatusResult } from "../model/types";

export function ApiStatus({ result }: { result: ApiStatusResult }) {
  const requestId = result.ok ? result.requestId : result.error.requestId;
  return (
    <Card>
      <CardHeader>
        <CardTitle aria-level={2}>Leitura do health check</CardTitle>
        <CardDescription>
          O contrato técnico confirma que a API responde HTTP; não verifica
          PostgreSQL ou Redis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Badge
          variant="soft"
          color={result.source === "mock" ? "warning" : "info"}
        >
          {result.source === "mock"
            ? "Fonte: mock explícito"
            : "Fonte: API real"}
        </Badge>
        <Alert variant={result.ok ? "success" : "danger"}>
          <AlertIcon />
          <AlertContent>
            <AlertTitle>
              {result.ok
                ? "API respondeu corretamente"
                : "Não foi possível concluir a leitura"}
            </AlertTitle>
            <AlertDescription>
              {result.ok
                ? 'Resposta validada: status "ok".'
                : result.error.message}
            </AlertDescription>
          </AlertContent>
        </Alert>
        {!result.ok && (
          <div className="space-y-2 body-sm">
            <p>
              Categoria: {result.error.kind}
              {result.error.status ? " · HTTP " + result.error.status : ""}
            </p>
            {Object.entries(result.error.fieldErrors).map(
              ([field, messages]) => (
                <p key={field}>
                  {field}: {messages.join(" ")}
                </p>
              ),
            )}
          </div>
        )}
        {requestId && (
          <p className="body-sm break-all text-text-secondary">
            Identificador da requisição: {requestId}
          </p>
        )}
        <a href="/dev/http" className="body-sm text-primary underline">
          Executar nova leitura
        </a>
      </CardContent>
    </Card>
  );
}

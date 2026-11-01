"use client";

import type { ReactNode } from "react";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  Button,
} from "bacurim-ui";

interface PageErrorStateProps {
  onRetry: () => void;
  children?: ReactNode;
}

export function PageErrorState({ onRetry, children }: PageErrorStateProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <Alert variant="danger">
        <AlertContent>
          <AlertTitle aria-level={1}>
            Não foi possível carregar esta página
          </AlertTitle>
          <AlertDescription>
            Tente novamente. Se o problema continuar, retorne à página anterior.
          </AlertDescription>
        </AlertContent>
      </Alert>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={onRetry}>Tentar novamente</Button>
        {children}
      </div>
    </div>
  );
}

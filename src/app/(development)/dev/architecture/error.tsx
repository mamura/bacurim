"use client";

import { PageErrorState } from "@shared/ui/page-error-state";

export default function ArchitectureError({ reset }: { reset: () => void }) {
  return (
    <PageErrorState onRetry={reset}>
      <a href="/dev/architecture" className="body-sm text-primary underline">
        Reabrir exemplo sem erro simulado
      </a>
    </PageErrorState>
  );
}

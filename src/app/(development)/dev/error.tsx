"use client";

import Link from "next/link";

import { PageErrorState } from "@shared/ui/page-error-state";

export default function DevelopmentError({ reset }: { reset: () => void }) {
  return (
    <PageErrorState onRetry={reset}>
      <Link href="/" className="body-sm text-primary underline">
        Voltar ao início
      </Link>
    </PageErrorState>
  );
}

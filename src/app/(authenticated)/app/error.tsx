"use client";
import { PageErrorState } from "@shared/ui/page-error-state";
export default function ApplicationError({ reset }: { reset: () => void }) {
  return <PageErrorState onRetry={reset} />;
}

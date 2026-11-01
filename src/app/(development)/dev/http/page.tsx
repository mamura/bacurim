import { ApiStatus } from "@features/api-status";
import { getApiStatus } from "@features/api-status/server";
import { isDevelopmentPreviewEnabled } from "@shared/lib/development-preview";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Comunicação com a API",
  robots: { index: false, follow: false },
};

export default async function HttpPreviewPage() {
  if (!isDevelopmentPreviewEnabled("http")) notFound();
  const result = await getApiStatus();
  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 p-4 sm:p-8">
      <h1 className="heading-lg">Comunicação com a API</h1>
      <p className="body-md text-text-secondary">
        Requisição no servidor para GET /api/v1/health, sem enviar dados
        financeiros ou credenciais.
      </p>
      <ApiStatus result={result} />
      <nav
        aria-label="Prévias técnicas"
        className="flex flex-wrap gap-4 body-sm text-primary"
      >
        <Link href="/dev/architecture" prefetch={false} className="underline">
          Exemplo de arquitetura
        </Link>
        <Link href="/dev/ui" prefetch={false} className="underline">
          Prévia do Bacurim UI
        </Link>
      </nav>
    </main>
  );
}

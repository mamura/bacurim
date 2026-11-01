import { FoundationDemo } from "@features/foundation-demo";
import { getFoundationItems } from "@features/foundation-demo/server";
import { isDevelopmentPreviewEnabled } from "@shared/lib/development-preview";
import { PageLoading } from "@shared/ui/page-loading";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Exemplo de arquitetura",
  robots: { index: false, follow: false },
};

export default async function ArchitecturePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isDevelopmentPreviewEnabled("architecture")) notFound();

  const params = await searchParams;

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 p-4 sm:p-8">
      <div className="space-y-2">
        <h1 className="heading-lg">Exemplo de arquitetura</h1>
        <p className="body-md text-text-secondary">
          Uma rota, uma feature e os estados compartilhados da aplicação.
        </p>
      </div>
      <nav
        aria-label="Cenários do exemplo"
        className="flex flex-wrap gap-4 body-sm text-primary"
      >
        <Link href="/dev/architecture" prefetch={false} className="underline">
          Normal
        </Link>
        <Link
          href="/dev/architecture?scenario=empty"
          prefetch={false}
          className="underline"
        >
          Lista vazia
        </Link>
        <Link
          href="/dev/architecture?scenario=loading"
          prefetch={false}
          className="underline"
        >
          Carregamento
        </Link>
        <Link
          href="/dev/architecture?scenario=error"
          prefetch={false}
          className="underline"
        >
          Erro de leitura
        </Link>
        <Link href="/dev/ui" prefetch={false} className="underline">
          Prévia do Bacurim UI
        </Link>
      </nav>
      <Suspense
        key={String(params.scenario ?? "ready")}
        fallback={<PageLoading />}
      >
        <DemoContent scenario={params.scenario} />
      </Suspense>
    </main>
  );
}

async function DemoContent({ scenario }: { scenario: unknown }) {
  const items = await getFoundationItems(scenario);
  return <FoundationDemo items={items} />;
}

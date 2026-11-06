"use client";
import { PageEmptyState } from "@shared/ui/page-empty-state";
import { PageErrorState } from "@shared/ui/page-error-state";
import { PageLoading } from "@shared/ui/page-loading";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import {
  organizationIdFromPath,
  useActiveOrganization,
} from "./active-organization";

function ValidatedOrganization({ children }: { children: ReactNode }) {
  const state = useActiveOrganization();
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    let live = true;
    void state.store.refresh().then(() => {
      if (live) setConfirmed(true);
    });
    return () => {
      live = false;
    };
  }, [state.store]);
  if (state.status === "error")
    return <PageErrorState onRetry={() => void state.store.refresh()} />;
  if (!confirmed || state.status === "loading") return <PageLoading />;
  if (!state.active)
    return (
      <PageEmptyState
        title="Empresa indisponível"
        description="Não foi possível acessar este ambiente. Verifique suas empresas disponíveis."
      >
        <Link href="/app" className="text-primary underline">
          Voltar às empresas
        </Link>
      </PageEmptyState>
    );
  return children;
}
export function OrganizationBoundary({ children }: { children: ReactNode }) {
  const id = organizationIdFromPath(usePathname());
  return (
    <ValidatedOrganization key={id ?? "invalid"}>
      {children}
    </ValidatedOrganization>
  );
}

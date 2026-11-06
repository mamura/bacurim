"use client";
import { LogoutButton } from "@shared/auth/logout-button";
import { useSession } from "@shared/auth/session-provider";
import { useOrganizations } from "@shared/organizations/organization-provider";
import {
  organizationPath,
  resolveOrganization,
} from "@shared/organizations/resolution";
import { PageEmptyState } from "@shared/ui/page-empty-state";
import { PageErrorState } from "@shared/ui/page-error-state";
import { PageLoading } from "@shared/ui/page-loading";
import { Button } from "bacurim-ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { OrganizationPicker } from "./organization-picker";

export function OrganizationEntry() {
  const { user } = useSession();
  const state = useOrganizations();
  const router = useRouter();
  const resolution =
    state.status === "ready" && user
      ? resolveOrganization(state.organizations, user.profile)
      : null;
  const directId =
    resolution?.kind === "direct"
      ? resolution.organization.public_id
      : undefined;
  useEffect(() => {
    if (directId) router.replace(organizationPath(directId));
  }, [directId, router]);
  if (state.status === "error")
    return <PageErrorState onRetry={() => void state.store.refresh()} />;
  if (!resolution || directId) return <PageLoading />;
  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-heading text-xl font-semibold">bacurim.</p>
        <LogoutButton />
      </div>
      {resolution.kind === "empty" ? (
        <PageEmptyState
          title="Nenhuma empresa disponível"
          description="Sua conta está ativa, mas não possui vínculo com uma empresa disponível. Solicite acesso ao responsável pela empresa."
        >
          <Button onClick={() => void state.store.refresh()}>
            Verificar novamente
          </Button>
        </PageEmptyState>
      ) : resolution.kind === "inconsistent" ? (
        <PageEmptyState
          title="Não foi possível resolver seu acesso"
          description="Os vínculos retornados precisam ser conferidos. Contate o suporte."
        >
          <Button onClick={() => void state.store.refresh()}>
            Verificar novamente
          </Button>
        </PageEmptyState>
      ) : (
        <>
          <header>
            <h1 className="heading-lg">Escolha uma empresa</h1>
            <p className="body-md mt-3 text-text-secondary">
              Olá, {user?.name}. Selecione o ambiente em que deseja trabalhar.
            </p>
          </header>
          <OrganizationPicker
            organizations={state.organizations}
            onSelect={(id) => {
              if (
                state.organizations.some(
                  (organization) => organization.public_id === id,
                )
              )
                router.push(organizationPath(id));
            }}
          />
        </>
      )}
    </main>
  );
}

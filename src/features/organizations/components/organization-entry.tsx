"use client";
import { useSession } from "@shared/auth/session-provider";
import { useOrganizations } from "@shared/organizations/organization-provider";
import {
  organizationPath,
  resolveOrganization,
} from "@shared/organizations/resolution";
import { PageErrorState } from "@shared/ui/page-error-state";
import { PageLoading } from "@shared/ui/page-loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="heading-lg">Suas empresas</h1>
      <p className="mt-4">Nenhuma empresa foi selecionada.</p>
    </main>
  );
}

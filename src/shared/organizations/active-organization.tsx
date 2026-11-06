"use client";
import { useSession } from "@shared/auth/session-provider";
import { usePathname, useRouter } from "next/navigation";

import { useOrganizations } from "./organization-provider";
import { organizationPath } from "./resolution";

export function organizationIdFromPath(pathname: string): string | undefined {
  const match = /^\/app\/organizations\/([a-zA-Z0-9-]+)(?:\/|$)/.exec(pathname);
  return match?.[1];
}
export function useActiveOrganization() {
  const state = useOrganizations();
  const { user } = useSession();
  const router = useRouter();
  const id = organizationIdFromPath(usePathname());
  const active =
    state.status === "ready" &&
    (user?.profile === "consultant" || state.organizations.length <= 1)
      ? (state.organizations.find(
          (organization) => organization.public_id === id,
        ) ?? null)
      : null;
  const canSwitch =
    user?.profile === "consultant" && state.organizations.length > 1;
  async function switchOrganization(target: string) {
    if (!canSwitch) return false;
    await state.store.refresh();
    const current = state.store.getSnapshot();
    if (
      current.status !== "ready" ||
      !current.organizations.some(
        (organization) => organization.public_id === target,
      )
    )
      return false;
    router.push(organizationPath(target));
    return true;
  }
  return { ...state, active, canSwitch, switchOrganization };
}

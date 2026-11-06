"use client";
import { useActiveOrganization } from "@shared/organizations/active-organization";

import type { PresentationPermission } from "./contracts";
import { canPresent } from "./contracts";
export function useAccess() {
  const { active, status } = useActiveOrganization();
  return {
    role: status === "ready" ? (active?.role ?? null) : null,
    allows: (permission: PresentationPermission) =>
      status === "ready" && canPresent(active, permission),
  };
}

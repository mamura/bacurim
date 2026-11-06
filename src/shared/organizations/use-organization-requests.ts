"use client";
import { useEffect, useMemo } from "react";

import { useActiveOrganization } from "./active-organization";
import { OrganizationRequestScope } from "./request-scope";

export function useOrganizationRequests() {
  const { active, revision, store } = useActiveOrganization();
  const id = active?.public_id;
  const scope = useMemo(
    () =>
      id
        ? new OrganizationRequestScope(id, () => void store.refresh(), revision)
        : null,
    [id, revision, store],
  );
  useEffect(() => () => scope?.close(), [scope]);
  return scope;
}

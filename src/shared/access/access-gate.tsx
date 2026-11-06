"use client";
import { Button } from "bacurim-ui";
import type { ReactNode } from "react";

import type { PresentationPermission } from "./contracts";
import { useAccess } from "./use-access";
export function AccessGate({
  permission,
  children,
  fallback = null,
}: {
  permission: PresentationPermission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const access = useAccess();
  return access.allows(permission) ? children : fallback;
}
export function ProtectedAction({
  permission,
  children,
  onClick,
}: {
  permission: PresentationPermission;
  children: ReactNode;
  onClick: () => void;
}) {
  const access = useAccess();
  const allowed = access.allows(permission);
  return (
    <Button
      disabled={!allowed}
      title={allowed ? undefined : "Seu papel não permite esta ação."}
      onClick={() => {
        if (access.allows(permission)) onClick();
      }}
    >
      {children}
    </Button>
  );
}

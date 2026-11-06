import { ApplicationShell } from "@features/application-shell";
import { OrganizationBoundary } from "@shared/organizations/organization-boundary";
import type { ReactNode } from "react";

export default function OrganizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <OrganizationBoundary>
      <ApplicationShell>{children}</ApplicationShell>
    </OrganizationBoundary>
  );
}

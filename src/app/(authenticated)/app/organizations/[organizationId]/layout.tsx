import { OrganizationBoundary } from "@shared/organizations/organization-boundary";
import type { ReactNode } from "react";
export default function OrganizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OrganizationBoundary>{children}</OrganizationBoundary>;
}

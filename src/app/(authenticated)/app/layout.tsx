import { AuthBoundary } from "@shared/auth/auth-boundary";
import { OrganizationProvider } from "@shared/organizations/organization-provider";
import type { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <AuthBoundary>
      <OrganizationProvider>{children}</OrganizationProvider>
    </AuthBoundary>
  );
}

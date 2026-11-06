import { AuthBoundary } from "@shared/auth/auth-boundary";
import type { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <AuthBoundary>{children}</AuthBoundary>;
}

"use client";
import { AppShell } from "bacurim-ui";
import type { ReactNode } from "react";
export function ApplicationFrame({
  children,
  navigation,
  header,
  mobileOpen = false,
  onMobileOpenChange,
}: {
  children: ReactNode;
  navigation?: ReactNode;
  header?: ReactNode;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}) {
  return (
    <AppShell
      header={header}
      navigation={navigation}
      mobileNavigationOpen={mobileOpen}
      onMobileNavigationOpenChange={onMobileOpenChange}
    >
      <div id="application-content" className="min-w-0">
        {children}
      </div>
    </AppShell>
  );
}

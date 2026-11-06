"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { ApplicationFrame } from "./application-frame";
import { ApplicationHeader } from "./application-header";
import { ApplicationNavigation } from "./application-navigation";

export function ApplicationShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);
  return (
    <ApplicationFrame
      mobileOpen={mobileOpen}
      onMobileOpenChange={setMobileOpen}
      navigation={
        <ApplicationNavigation
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onNavigate={() => setMobileOpen(false)}
        />
      }
      header={
        <ApplicationHeader
          mobileOpen={mobileOpen}
          onOpenNavigation={() => setMobileOpen(true)}
        />
      }
    >
      {children}
    </ApplicationFrame>
  );
}

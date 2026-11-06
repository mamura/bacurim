"use client";
import type { ReactNode } from "react";
import { useState } from "react";

import { ApplicationFrame } from "./application-frame";
import { ApplicationHeader } from "./application-header";
import { ApplicationNavigation } from "./application-navigation";
export function ApplicationShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <ApplicationFrame
      navigation={
        <ApplicationNavigation
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
      }
      header={<ApplicationHeader />}
    >
      {children}
    </ApplicationFrame>
  );
}

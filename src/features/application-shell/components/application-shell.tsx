"use client";
import type { ReactNode } from "react";

import { ApplicationFrame } from "./application-frame";
export function ApplicationShell({ children }: { children: ReactNode }) {
  return (
    <ApplicationFrame
      header={
        <header className="bg-primary p-4 text-primary-contrast">
          <span className="font-heading font-semibold">bacurim.</span>
        </header>
      }
    >
      {children}
    </ApplicationFrame>
  );
}

import "./globals.css";

import { appConfig } from "@shared/config/app";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: appConfig.url,
  applicationName: appConfig.name,
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={appConfig.locale}>
      <body className="bg-background font-body text-text-primary">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UiPreview } from "@features/ui-preview";
import { isDevelopmentPreviewEnabled } from "@shared/lib/development-preview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Validação do Bacurim UI",
  robots: { index: false, follow: false },
};

export default function UiPreviewPage() {
  if (!isDevelopmentPreviewEnabled("ui")) {
    notFound();
  }

  return <UiPreview />;
}

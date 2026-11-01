import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UiPreview } from "@features/ui-preview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Validação do Bacurim UI",
  robots: { index: false, follow: false },
};

export default function UiPreviewPage() {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.ENABLE_UI_PREVIEW !== "true"
  ) {
    notFound();
  }

  return <UiPreview />;
}

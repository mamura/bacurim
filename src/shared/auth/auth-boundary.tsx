"use client";
import { PageErrorState } from "@shared/ui/page-error-state";
import { PageLoading } from "@shared/ui/page-loading";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { safeDestination } from "./safe-destination";
import { useSession } from "./session-provider";

export function AuthBoundary({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (session.store.getSnapshot().status === "loading")
      void session.store.refresh();
  }, [session.store]);
  useEffect(() => {
    if (session.status === "unauthenticated")
      router.replace(
        "/login?next=" +
          encodeURIComponent(
            safeDestination(pathname + window.location.search),
          ),
      );
  }, [session.status, pathname, router]);
  if (session.status === "error")
    return <PageErrorState onRetry={() => void session.store.refresh()} />;
  if (session.status !== "authenticated" || !session.user)
    return <PageLoading />;
  return children;
}

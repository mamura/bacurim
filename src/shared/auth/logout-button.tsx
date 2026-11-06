"use client";
import { Button } from "bacurim-ui";

import { useSession } from "./session-provider";
export function LogoutButton({
  variant = "outline",
}: {
  variant?: "outline" | "white";
}) {
  const { store, status } = useSession();
  return (
    <Button
      variant={variant}
      disabled={status !== "authenticated"}
      onClick={() => void store.logout()}
    >
      Sair
    </Button>
  );
}

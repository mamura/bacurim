"use client";
import { Button } from "bacurim-ui";

import { useSession } from "./session-provider";
export function LogoutButton() {
  const { store, status } = useSession();
  return (
    <Button
      variant="outline"
      disabled={status !== "authenticated"}
      onClick={() => void store.logout()}
    >
      Sair
    </Button>
  );
}

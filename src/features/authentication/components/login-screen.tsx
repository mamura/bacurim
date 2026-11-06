"use client";
import { safeDestination } from "@shared/auth/safe-destination";
import { useSession } from "@shared/auth/session-provider";
import { useRouter } from "next/navigation";

import { login } from "../services/login";
import { LoginForm } from "./login-form";

export function LoginScreen() {
  const router = useRouter();
  const { store } = useSession();
  return (
    <LoginForm
      authenticate={async (input) => {
        store.acceptUser(await login(input));
      }}
      onSuccess={() => {
        const destination = new URLSearchParams(window.location.search).get(
          "next",
        );
        router.replace(safeDestination(destination));
        router.refresh();
      }}
    />
  );
}

"use client";
import { safeDestination } from "@shared/auth/safe-destination";
import { useRouter } from "next/navigation";

import { login } from "../services/login";
import { LoginForm } from "./login-form";

export function LoginScreen() {
  const router = useRouter();
  return (
    <LoginForm
      authenticate={async (input) => {
        await login(input);
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

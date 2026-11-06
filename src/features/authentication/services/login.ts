import { readAuthUser } from "@shared/auth/contracts";
import { createBrowserApiClient } from "@shared/http/browser";

import type { LoginInput } from "../model/login-validation";

export async function login(input: LoginInput) {
  const client = createBrowserApiClient();
  await client.request("sanctum/csrf-cookie");
  const response = await client.request("api/v1/auth/login", {
    method: "POST",
    body: input,
  });
  return readAuthUser(response.data);
}

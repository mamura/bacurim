import { ApiError } from "@shared/http";

export type UserProfile = "standard" | "consultant";
export interface AuthUser {
  public_id: string;
  name: string;
  email: string;
  profile: UserProfile;
  status: "active" | "inactive";
  email_verified_at: string | null;
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function readAuthUser(value: unknown): AuthUser {
  const data = isRecord(value) ? value.data : undefined;
  if (
    !isRecord(data) ||
    typeof data.public_id !== "string" ||
    typeof data.name !== "string" ||
    typeof data.email !== "string" ||
    !["standard", "consultant"].includes(String(data.profile)) ||
    !["active", "inactive"].includes(String(data.status)) ||
    !(
      data.email_verified_at === null ||
      typeof data.email_verified_at === "string"
    )
  )
    throw new ApiError("invalid-response");
  return {
    public_id: data.public_id,
    name: data.name,
    email: data.email,
    profile: data.profile as UserProfile,
    status: data.status as AuthUser["status"],
    email_verified_at: data.email_verified_at as string | null,
  };
}

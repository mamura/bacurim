"use client";
import { useSession } from "@shared/auth/session-provider";
import { useActiveOrganization } from "@shared/organizations/active-organization";
export default function MyAccessPage() {
  const { user } = useSession();
  const { active } = useActiveOrganization();
  return (
    <section className="mx-auto max-w-5xl space-y-4 p-6">
      <h1 className="heading-lg">Meu acesso</h1>
      <p>{user?.name}</p>
      <p>{active?.name}</p>
      <p className="body-sm text-text-secondary">
        Seu acesso depende do vínculo atual com esta empresa e é validado pela
        API em cada operação.
      </p>
    </section>
  );
}

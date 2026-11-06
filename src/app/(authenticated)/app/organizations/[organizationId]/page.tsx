"use client";
import { useActiveOrganization } from "@shared/organizations/active-organization";
export default function OrganizationHome() {
  const { active } = useActiveOrganization();
  return (
    <section className="mx-auto max-w-5xl space-y-4 p-6">
      <h1 className="heading-lg">{active?.name}</h1>
      <p>
        Seu ambiente empresarial está pronto para receber os módulos do Bacurim.
      </p>
    </section>
  );
}

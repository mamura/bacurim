"use client";
import { useActiveOrganization } from "@shared/organizations/active-organization";
import { organizationPath } from "@shared/organizations/resolution";
import { PageContent } from "@shared/ui/page-content";
import { Card, CardContent, CardHeader } from "bacurim-ui";
import Link from "next/link";
export default function OrganizationHome() {
  const { active } = useActiveOrganization();
  return (
    <PageContent
      title="Bem-vindo ao seu espaço"
      description={
        active ? "Você está no ambiente de " + active.name + "." : undefined
      }
    >
      <Card>
        <CardHeader>
          <h2 className="heading-sm">Sua empresa</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="body-md break-words">{active?.name}</p>
          <p className="body-sm text-text-primary">
            As funcionalidades da empresa aparecerão aqui conforme forem
            disponibilizadas.
          </p>
          {active && (
            <Link
              href={organizationPath(active.public_id) + "/access"}
              className="body-sm text-primary underline"
            >
              Consultar meu acesso
            </Link>
          )}
        </CardContent>
      </Card>
    </PageContent>
  );
}

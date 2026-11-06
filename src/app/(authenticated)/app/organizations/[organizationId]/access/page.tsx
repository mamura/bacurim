"use client";
import { roleLabels } from "@shared/access/contracts";
import { useSession } from "@shared/auth/session-provider";
import { useActiveOrganization } from "@shared/organizations/active-organization";
import { PageContent } from "@shared/ui/page-content";
import { Badge, Card, CardContent } from "bacurim-ui";
export default function MyAccessPage() {
  const { user } = useSession();
  const { active } = useActiveOrganization();
  return (
    <PageContent
      title="Meu acesso"
      description="Confira sua identidade e seu vínculo com esta empresa."
    >
      <Card>
        <CardContent className="space-y-6 p-6">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="body-sm text-text-secondary">Nome</dt>
              <dd className="mt-1 break-words">{user?.name}</dd>
            </div>
            <div>
              <dt className="body-sm text-text-secondary">E-mail</dt>
              <dd className="mt-1 break-all">{user?.email}</dd>
            </div>
            <div>
              <dt className="body-sm text-text-secondary">Empresa</dt>
              <dd className="mt-1 break-words">{active?.name}</dd>
            </div>
            <div>
              <dt className="body-sm text-text-secondary">Papel na empresa</dt>
              <dd className="mt-1">
                <Badge variant="soft">
                  {active ? roleLabels[active.role] : "Indisponível"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="body-sm text-text-secondary">
                Perfil na plataforma
              </dt>
              <dd className="mt-1">
                {user?.profile === "consultant" ? "Consultor" : "Padrão"}
              </dd>
            </div>
          </dl>
          <p className="body-sm text-text-secondary">
            Seu papel é específico desta empresa. O perfil de consultor permite
            atuar em múltiplas empresas, sem conceder permissões adicionais em
            nenhuma delas.
          </p>
        </CardContent>
      </Card>
    </PageContent>
  );
}

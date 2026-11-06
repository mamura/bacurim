"use client";
import type { AuthorizedOrganization } from "@shared/organizations/contracts";
import { Button, Card, CardContent } from "bacurim-ui";

export function OrganizationPicker({
  organizations,
  onSelect,
}: {
  organizations: readonly AuthorizedOrganization[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2" aria-label="Empresas autorizadas">
      {organizations.map((organization) => (
        <li key={organization.public_id}>
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="heading-sm break-words">{organization.name}</h2>
              <Button
                className="w-full"
                aria-label={"Acessar " + organization.name}
                onClick={() => onSelect(organization.public_id)}
              >
                Acessar empresa
              </Button>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

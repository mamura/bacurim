"use client";
import { Button, Header } from "bacurim-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@shared/auth/session-provider";
import { LogoutButton } from "@shared/auth/logout-button";
import { useActiveOrganization } from "@shared/organizations/active-organization";
import { organizationPath } from "@shared/organizations/resolution";

export function ApplicationHeader({ onOpenNavigation, mobileOpen = false }: { onOpenNavigation?: () => void; mobileOpen?: boolean }) {
  const { user } = useSession();
  const { active, canSwitch } = useActiveOrganization();
  const router = useRouter();
  return <Header className="gap-2 px-4 sm:px-6" logo={<Link className="min-w-0 max-w-[42vw]" href={active ? organizationPath(active.public_id) : "/app"}><span className="block truncate font-heading font-semibold">bacurim.</span><span className="block truncate text-xs" title={active?.name}>{active?.name}</span></Link>}
    navigation={<span className="max-w-full truncate text-sm">{user?.name}</span>}
    actions={<><Button className="lg:hidden" variant="white" size="sm" aria-label="Abrir navegação" aria-expanded={mobileOpen} onClick={onOpenNavigation}>Menu</Button>
    {canSwitch && <Button variant="white" size="sm" onClick={() => router.push("/app")}>Trocar empresa</Button>}
    <LogoutButton /></>} />;
}

"use client";
import { useActiveOrganization } from "@shared/organizations/active-organization";
import { Sidebar } from "bacurim-ui";
import { Home, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { navigationForOrganization } from "../model/navigation";

export function ApplicationNavigation({
  collapsed,
  onCollapsedChange,
  onNavigate,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: () => void;
}) {
  const { active } = useActiveOrganization();
  const pathname = usePathname();
  const router = useRouter();
  const items = active ? navigationForOrganization(active) : [];
  return (
    <Sidebar
      className="[&_.caption]:text-text-primary"
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      header={
        <span className="font-heading font-semibold">
          {collapsed ? "b." : "bacurim."}
        </span>
      }
      activeItemId={items.find((item) => item.href === pathname)?.id}
      groups={[
        {
          id: "workspace",
          label: "Ambiente empresarial",
          items: items.map((item) => ({
            id: item.id,
            label: item.label,
            href: item.href,
            icon:
              item.id === "home" ? (
                <Home size={20} />
              ) : (
                <ShieldCheck size={20} />
              ),
            onClick: (event) => {
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              event.preventDefault();
              onNavigate?.();
              router.push(item.href);
            },
          })),
        },
      ]}
      footer={
        !collapsed && (
          <p className="caption text-text-primary">
            Seu ambiente, com clareza.
          </p>
        )
      }
    />
  );
}

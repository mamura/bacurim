import type { ReactNode } from "react";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateTitle,
} from "bacurim-ui";

interface PageEmptyStateProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageEmptyState({ title, description, children }: PageEmptyStateProps) {
  return (
    <EmptyState>
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
      {children && <EmptyStateActions>{children}</EmptyStateActions>}
    </EmptyState>
  );
}

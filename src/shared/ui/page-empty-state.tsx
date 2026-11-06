import { EmptyState, EmptyStateActions } from "bacurim-ui";
import type { ReactNode } from "react";
interface PageEmptyStateProps {
  title: string;
  description: string;
  children?: ReactNode;
  headingLevel?: 1 | 2;
}
export function PageEmptyState({
  title,
  description,
  children,
  headingLevel = 2,
}: PageEmptyStateProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <EmptyState>
      <Heading className="heading-md">{title}</Heading>
      <p className="body-md max-w-xl text-text-primary">{description}</p>
      {children && <EmptyStateActions>{children}</EmptyStateActions>}
    </EmptyState>
  );
}

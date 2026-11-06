import { AccessState } from "@shared/access/access-state";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
test.each([
  [401, "Entre novamente"],
  [403, "Acesso não permitido"],
  [404, "Ambiente indisponível"],
] as const)(
  "apresenta estado %s sem revelar recurso estrangeiro",
  (status, message) => {
    render(<AccessState status={status} />);
    expect(screen.getByRole("alert")).toHaveTextContent(message);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      status === 401 ? "/login" : "/app",
    );
    expect(
      screen.queryByText(/org-|membership_|secret/i),
    ).not.toBeInTheDocument();
  },
);

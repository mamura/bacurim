import { AuthBoundary } from "@shared/auth/auth-boundary";
import { SessionProvider } from "@shared/auth/session-provider";
import { SessionStore } from "@shared/auth/session-store";
import { ApiError } from "@shared/http";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
const navigation = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
  usePathname: () => "/app/private",
}));

test("não exibe children privados antes da validação e redireciona anônimo", async () => {
  const store = new SessionStore(async () => {
    throw new ApiError("http", { status: 401 });
  });
  render(
    <SessionProvider store={store}>
      <AuthBoundary>
        <p>Conteúdo privado</p>
      </AuthBoundary>
    </SessionProvider>,
  );
  expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
  await waitFor(() =>
    expect(navigation.replace).toHaveBeenCalledWith(
      "/login?next=%2Fapp%2Fprivate",
    ),
  );
  expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
});
test("falha de rede mostra recuperação sem declarar sessão encerrada", async () => {
  const store = new SessionStore(async () => {
    throw new ApiError("network");
  });
  render(
    <SessionProvider store={store}>
      <AuthBoundary>
        <p>Conteúdo privado</p>
      </AuthBoundary>
    </SessionProvider>,
  );
  expect(
    await screen.findByRole("button", { name: "Tentar novamente" }),
  ).toBeInTheDocument();
  expect(store.getSnapshot().status).toBe("error");
  expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
});

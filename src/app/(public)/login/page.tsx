import { LoginForm } from "@features/authentication";
import { Card, CardContent, CardHeader, CardTitle } from "bacurim-ui";

export const metadata = { title: "Entrar | Bacurim" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle aria-level={1}>Entre na sua conta</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}

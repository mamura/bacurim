import { Card, CardContent, CardHeader, CardTitle } from "bacurim-ui";

export const metadata = { title: "Entrar | Bacurim" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle aria-level={1}>Entre na sua conta</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Use seu e-mail e senha para acessar o Bacurim.</p>
      </CardContent>
    </Card>
  );
}

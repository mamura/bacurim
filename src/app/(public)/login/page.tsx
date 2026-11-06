import { LoginScreen } from "@features/authentication";
import { Card, CardContent, CardHeader } from "bacurim-ui";

export const metadata = { title: "Entrar | Bacurim" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="heading-md">Entre na sua conta</h1>
      </CardHeader>
      <CardContent>
        <LoginScreen />
      </CardContent>
    </Card>
  );
}

"use client";

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AppShell,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormattedValue,
  FormField,
  FormFieldControl,
  FormFieldDescription,
  FormFieldError,
  FormFieldLabel,
  Header,
  Input,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sidebar,
  Skeleton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ToastProvider,
  useToast,
} from "bacurim-ui";
import Link from "next/link";
import { type FormEvent, useState } from "react";

export function UiPreview() {
  return (
    <ToastProvider position="bottom-right">
      <PreviewContent />
    </ToastProvider>
  );
}

function PreviewContent() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("components");
  const [name, setName] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [variant, setVariant] = useState("primary");
  const toast = useToast();

  function navigate(section: string) {
    setActive(section);
    setMobileOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (invalid) return;
    setSaving(true);
    setSaved(false);
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setSaving(false);
    setSaved(true);
    toast.success({
      title: "Interação validada",
      description: "Nenhum dado foi enviado ou armazenado.",
    });
  }

  const navigation = (
    <Sidebar
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      activeItemId={active}
      header={
        <span className="font-heading font-semibold">
          {collapsed ? "B" : "Bacurim UI"}
        </span>
      }
      groups={[
        {
          id: "preview",
          label: "Validação",
          items: [
            {
              id: "components",
              label: "Componentes",
              onClick: () => navigate("components"),
            },
            {
              id: "forms",
              label: "Formulários",
              onClick: () => navigate("forms"),
            },
            { id: "data", label: "Dados", onClick: () => navigate("data") },
            { id: "unavailable", label: "Indisponível", disabled: true },
          ],
        },
      ]}
      footer={
        !collapsed && (
          <span className="caption text-text-secondary">Pacote 0.1.0</span>
        )
      }
    />
  );

  return (
    <AppShell
      navigation={navigation}
      mobileNavigationOpen={mobileOpen}
      onMobileNavigationOpenChange={setMobileOpen}
      header={
        <Header
          logo={
            <Link
              href="/"
              className="font-heading text-heading-sm font-semibold"
            >
              Bacurim
            </Link>
          }
          actions={
            <>
              <Badge variant="white">Prévia técnica</Badge>
              <Button
                variant="white"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                Abrir navegação
              </Button>
            </>
          }
        />
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 sm:p-8">
        <div className="space-y-2">
          <h1 className="heading-lg">Integração do Bacurim UI</h1>
          <p className="body-md text-text-secondary">
            Componentes do pacote em execução no Next.js. Esta rota é temporária
            e não utiliza a API.
          </p>
        </div>

        <section
          id="components"
          className="scroll-mt-6 space-y-4"
          aria-labelledby="components-title"
        >
          <h2 id="components-title" className="heading-md">
            Componentes e feedback
          </h2>
          <Alert variant="info">
            <AlertIcon />
            <AlertContent>
              <AlertTitle>Ambiente de validação</AlertTitle>
              <AlertDescription>
                Confira estados, fontes, cores e interações antes de aprovar a
                integração.
              </AlertDescription>
            </AlertContent>
          </Alert>
          <div className="grid min-w-0 gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ações e estados</CardTitle>
                <CardDescription>
                  Variantes, estado desabilitado e sobreposições.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() =>
                    toast.info({
                      title: "Botão acionado",
                      description: "O evento chegou ao componente cliente.",
                    })
                  }
                >
                  Testar ação
                </Button>
                <Button variant="outline">Contorno</Button>
                <Button disabled>Desabilitado</Button>
                <Button loading loadingText="Carregando">
                  Carregar
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="soft">Abrir diálogo</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Diálogo de validação</DialogTitle>
                      <DialogDescription>
                        Teste o foco, Escape e o fechamento.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogBody>
                      <p className="body-md">
                        Este componente é renderizado por um portal do Radix.
                      </p>
                    </DialogBody>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button>Concluir</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tokens e carregamento</CardTitle>
                <CardDescription>
                  Poppins nos títulos e Inter nos textos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge color="primary">Primário</Badge>
                  <Badge color="success" variant="soft">
                    Sucesso
                  </Badge>
                  <Badge color="warning" variant="soft">
                    Atenção
                  </Badge>
                  <Badge color="error" variant="outline">
                    Erro
                  </Badge>
                </div>
                <Progress value={65} label="Progresso de exemplo" showValue />
                <Skeleton
                  className="h-4 w-3/4"
                  aria-label="Conteúdo carregando"
                />
                <div className="rounded-md border border-border bg-surface p-4 shadow-md">
                  <span className="body-sm">
                    Tokens de borda, espaçamento, radius e sombra do pacote.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="forms"
          className="scroll-mt-6 space-y-4"
          aria-labelledby="forms-title"
        >
          <h2 id="forms-title" className="heading-md">
            Formulários
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Interação local</CardTitle>
              <CardDescription>
                Os valores existem apenas nesta página.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
                <FormField required invalid={invalid}>
                  <FormFieldLabel>Nome de exemplo</FormFieldLabel>
                  <FormFieldControl>
                    <Input
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setSaved(false);
                      }}
                      placeholder="Digite um nome"
                      invalid={invalid}
                    />
                  </FormFieldControl>
                  <FormFieldDescription>
                    Campo para testar digitação e foco.
                  </FormFieldDescription>
                  {invalid && (
                    <FormFieldError>
                      Erro de validação demonstrativo.
                    </FormFieldError>
                  )}
                </FormField>
                <div className="space-y-2">
                  <label
                    htmlFor="preview-select"
                    className="body-sm font-medium"
                  >
                    Cor de exemplo
                  </label>
                  <Select value={variant} onValueChange={setVariant}>
                    <SelectTrigger id="preview-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primária</SelectItem>
                      <SelectItem value="secondary">Secundária</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="body-sm text-text-secondary">
                    Seleção: {variant === "primary" ? "Primária" : "Secundária"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="preview-disabled"
                    className="body-sm font-medium"
                  >
                    Campo indisponível
                  </label>
                  <Input
                    id="preview-disabled"
                    disabled
                    value="Somente demonstração"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="preview-invalid"
                    checked={invalid}
                    onCheckedChange={(value) => setInvalid(value === true)}
                  />
                  <label htmlFor="preview-invalid" className="body-sm">
                    Mostrar estado de erro
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                  <Button
                    type="submit"
                    loading={saving}
                    loadingText="Validando..."
                    disabled={invalid}
                  >
                    Validar formulário
                  </Button>
                  <p role="status" className="body-sm text-text-secondary">
                    {saved
                      ? "Formulário validado localmente."
                      : "Nenhuma informação será enviada."}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        <section
          id="data"
          className="scroll-mt-6 space-y-4"
          aria-labelledby="data-title"
        >
          <h2 id="data-title" className="heading-md">
            Apresentação de dados
          </h2>
          <Card>
            <CardContent className="min-w-0 overflow-x-auto">
              <Table>
                <TableCaption>
                  Dados estáticos para validar os componentes.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Componente</TableHead>
                    <TableHead>Exemplo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>FormattedValue</TableCell>
                    <TableCell>
                      <FormattedValue type="currency" value={1234.56} />
                    </TableCell>
                    <TableCell>
                      <Badge color="success" variant="soft">
                        Disponível
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Badge</TableCell>
                    <TableCell>Conteúdo estático</TableCell>
                    <TableCell>
                      <Badge color="info" variant="soft">
                        Informativo
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

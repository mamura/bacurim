# Convenções iniciais

## Ambiente

Copie `.env.example` para `.env.local`. O Next.js carrega esse arquivo
automaticamente na execução local e no Compose (o diretório está montado).
Nenhuma variável é obrigatória para executar a página inicial.

| Variável | Visibilidade | Padrão | Finalidade |
| --- | --- | --- | --- |
| APP_URL | Servidor | http://bacurim.mamura.test | URL absoluta da aplicação; use a URL pública no build de produção. |
| ENABLE_UI_PREVIEW | Servidor | false | Habilita /dev/ui em produção somente com o valor true; em desenvolvimento a prévia está disponível. |
| ENABLE_ARCHITECTURE_PREVIEW | Servidor | false | Habilita /dev/architecture em produção somente com o valor true. |

Variáveis sem prefixo são privadas ao servidor. Nunca reexporte credenciais
para componentes cliente, propriedades serializadas ou respostas HTTP.
Módulos que acessam configuração privada devem importar `server-only`;
isso faz o build rejeitar imports desses módulos por Client Components.

Use `NEXT_PUBLIC_*` apenas para valores deliberadamente públicos: o Next.js
os incorpora no JavaScript durante o build. Alterá-los requer novo build.
Não existe variável pública necessária nesta etapa. Não configure `env`
em `next.config.ts` para repassar valores privados ao navegador.

Apenas `.env.example` deve ser versionado. Não inclua credenciais reais nele.
O cliente HTTP e as variáveis da API serão definidos em sua própria issue.

## Arquivos e imports

- Código da aplicação em `src/`, com arquivos TypeScript (`.ts` ou `.tsx`).
- `src/app/` contém as rotas e os arquivos especiais do App Router.
- `src/shared/config/app.ts` reúne os parâmetros iniciais usados no servidor.
- `@/*` aponta para `src/*`; `@features/*` e `@shared/*` são os namespaces dos módulos.
- Imports externos às features usam apenas suas entradas públicas.
- Arquivos comuns usam kebab-case; componentes exportados usam PascalCase.
- Preserve os nomes reservados do Next.js: `page.tsx`, `layout.tsx`, etc.
- Use UTF-8, LF e dois espaços, conforme `.editorconfig`.
- TypeScript permanece em modo estrito, sem emissão de JavaScript pelo tsc.
- Componentes são Server Components por padrão. Use `"use client"` quando
  houver necessidade concreta de interatividade no navegador.

A arquitetura por funcionalidades está definida em [architecture.md](architecture.md).
Não crie camadas ou pastas vazias antecipadamente. Componentes e tokens visuais
compartilhados pertencem ao Bacurim UI.

## Entrega de cada tarefa

Implemente uma sub-issue por vez. Valide os tipos e o build quando houver
mudança executável, execute check:architecture, revise o diff, crie um commit com referência à issue
e faça push antes de iniciar a próxima. Alterações apenas documentais
exigem conferir comandos, caminhos e consistência com a configuração.

Trabalhe diretamente na branch master, sem branches auxiliares ou PRs.
Conclua a implementação da issue principal e de suas sub-issues e aguarde
a validação do usuário. Feche as issues somente após essa aprovação e
então avance para a próxima issue principal.

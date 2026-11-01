# Bacurim

Frontend com Next.js, React, TypeScript estrito e App Router.

## Desenvolvimento

Execute no WSL com Node.js 24 LTS e npm 10 ou superior:

```bash
nvm use
npm ci
npm run dev
```

Acesse http://localhost:3000. A página inicial funciona sem a API.

## Validação e produção

```bash
npm run typecheck
npm run build
npm start
```

## Estrutura inicial

- `src/app/layout.tsx`: layout raiz do App Router.
- `src/app/page.tsx`: rota inicial temporária.
- `next.config.ts`: configuração e origem local permitida.
- `tsconfig.json`: TypeScript estrito e alias `@/*` para `src/*`.

Implementação da issue #2, parte da issue #1. Tailwind e estilos (#3),
ambiente (#4), metadados (#5) e documentação consolidada (#6) serão
tratados separadamente. Integração com Bacurim UI pertence à issue #7.

## Desenvolvimento com Traefik

Com Docker Compose e o Traefik existente conectado à rede `dev-network`:

```bash
docker compose up -d
docker compose logs -f web
```

Após a instalação das dependências, acesse http://bacurim.mamura.test.
O domínio deve resolver para a máquina do Docker (por exemplo, uma entrada
`127.0.0.1 bacurim.mamura.test` no arquivo hosts). O roteador utiliza o
entrypoint HTTP `web` existente. O Compose roda somente o frontend, sem
exigir os serviços da API. Dependências e cache ficam em volumes próprios.

Para parar este ambiente:

```bash
docker compose down
```

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

Implementação das issues #2 e #3, parte da issue #1. Ambiente (#4),
metadados (#5) e documentação consolidada (#6) serão tratados
separadamente. Integração com Bacurim UI pertence à issue #7.

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


## Estilos globais e Tailwind CSS

O Tailwind CSS 4.3.3 usa o plugin `@tailwindcss/postcss`, configurado em
`postcss.config.mjs`. A versão acompanha a utilizada no Bacurim UI.
`src/app/globals.css` concentra os imports globais e é carregado uma única
vez pelo layout raiz, usando o alias `@/`.

As classes são detectadas nos arquivos da aplicação automaticamente.
A rota temporária usa utilitários de espaçamento, tipografia e responsividade
para validar a geração do CSS.

Os tokens de cores, fontes, espaçamento, radius e shadows pertencem ao
Bacurim UI. Não copie os arquivos de foundations nem crie valores
equivalentes na aplicação. O import público do CSS da biblioteca e as
fontes serão configurados na integração (#7 e #10), após definir os
exports do pacote. Até lá, a aplicação usa os utilitários padrão do Tailwind.

Preflight é o único reset atual. Na integração, verifique o CSS distribuído
pela biblioteca para manter apenas um reset e defina a ordem dos imports
globais aqui. Não importe o código-fonte do repositório vizinho.

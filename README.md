# Bacurim

Frontend do Bacurim. Esta base implementa a inicialização da aplicação
(issue #1, sub-issues #2 a #6), com uma página temporária independente da API.

## Requisitos

| Ferramenta | Versão |
| --- | --- |
| Node.js | 24 LTS (use `.nvmrc`) |
| npm | 10 ou superior |
| Git | Disponível no ambiente |
| Docker e Compose | Necessários apenas para executar com Traefik |

Execute os comandos no Linux/WSL, dentro de `bacurim-web`.
Use apenas um modo de desenvolvimento por vez.

## Instalação e execução local

```bash
git clone https://github.com/mamura/bacurim.git bacurim-web
cd bacurim-web
nvm install
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Se já possui o checkout, entre nele e comece em `nvm install`.
O comando `nvm` requer o Node Version Manager instalado no shell.
Sem nvm, instale Node 24 por outro meio.

Acesse [localhost:3000](http://localhost:3000). O servidor escuta em
`0.0.0.0` para permitir acesso pelo ambiente WSL.
A API, PostgreSQL e Redis não são necessários para a página inicial.

## Desenvolvimento com Docker e Traefik

O Compose do frontend é independente do Compose da pasta pai.
Ele requer o Traefik existente com entrypoint HTTP `web`, provider Docker
e conexão à rede externa `dev-network`. O arquivo não cria o proxy.

```bash
cp .env.example .env.local
docker network inspect dev-network
docker compose config --quiet
docker compose up -d
docker compose logs -f web
```

Acesse [bacurim.mamura.test](http://bacurim.mamura.test) após a instalação
das dependências e a mensagem de que o Next.js está pronto.
O domínio deve resolver para a máquina do Docker. Para um ambiente local,
configure `127.0.0.1 bacurim.mamura.test` no arquivo hosts do sistema em que
o navegador está executando (no Windows: `C:\Windows\System32\drivers\etc\hosts`).

O container usa Node 24 e executa `npm ci && npm run dev`.
Os arquivos são montados para atualização automática; dependências e
cache ficam nos volumes `web_node_modules` e `web_next`.
Após alterar dependências ou configurações de ambiente, reinicie:

```bash
docker compose restart web
```

Para parar o frontend, preservando os volumes:

```bash
docker compose down
```

Este Compose é exclusivo de desenvolvimento. A porta 3000 não é publicada
no host por ele; o acesso ocorre pelo Traefik via HTTP.

## Comandos de validação e produção

| Comando | Finalidade |
| --- | --- |
| `npm ci` | Instalar exatamente as versões do lockfile |
| `npm run dev` | Executar o servidor com atualização automática |
| `npm run check:architecture` | Verificar limites de imports e ciclos |
| `npm run typecheck` | Gerar tipos das rotas e verificar TypeScript |
| `npm run build` | Gerar o build otimizado em `.next/` |
| `npm start` | Servir um build de produção existente |

Antes de entregar alterações executáveis:

```bash
npm run check:architecture
npm run typecheck
npm run build
```

Para verificar a execução de produção local, pare o servidor de
desenvolvimento que usa a porta 3000 e execute:

```bash
npm start
```

Não execute `dev` e `build` simultaneamente sobre o mesmo diretório de
saída. O container mantém seu próprio cache, separado do build no host.
Lint, testes automatizados e CI serão configurados nas issues específicas.

## Ambiente

`.env.example` é a referência versionada; `.env.local` contém os valores
locais e é ignorado pelo Git. Sua criação é opcional: a configuração atual
tem um padrão e não exige credenciais.

| Variável | Padrão | Uso |
| --- | --- | --- |
| `APP_URL` | `http://bacurim.mamura.test` | URL absoluta HTTP(S) para os metadados da aplicação |
| `ENABLE_UI_PREVIEW` | `false` | Libera a prévia técnica em produção apenas quando definido como true |
| `ENABLE_ARCHITECTURE_PREVIEW` | `false` | Libera o exemplo de arquitetura em produção apenas quando definido como true |

Para usar a URL local como referência, defina `APP_URL=http://localhost:3000`.
Na produção, configure a URL pública **antes do build**, pois a rota atual
é pré-renderizada. Alterar esse valor depois exige gerar outro build.

Variáveis sem prefixo são do servidor. `NEXT_PUBLIC_*` identifica valores
públicos incorporados no JavaScript durante o build; nunca use esse prefixo
para credenciais. Não há variável pública necessária nesta etapa.
Veja [as convenções de ambiente e código](docs/conventions.md).

## Estrutura

```text
src/
  app/                          # Rotas, layouts e composição
    (development)/dev/          # Prévias técnicas com URLs /dev/*
  features/
    ui-preview/                 # Prévia da biblioteca aprovada
    foundation-demo/            # Exemplo isolado de arquitetura
  shared/
    config/                     # Configuração privada
    lib/                        # Controle das prévias
    ui/                         # Loading, error e empty
scripts/check-architecture.mjs   # Verificação dos limites e ciclos
docs/adr/                       # Registros de decisão
```

O alias `@/*` aponta para `src/*`. TypeScript opera em modo estrito.
A arquitetura por funcionalidades está definida no [guia de arquitetura](docs/architecture.md).

## Estilos e Bacurim UI

Tailwind CSS 4.3.3 é processado pelo plugin `@tailwindcss/postcss`.
O layout importa `src/app/globals.css` uma única vez. Tailwind fornece
o único reset (Preflight); a página temporária usa seus utilitários
de layout e tipografia, incluindo um breakpoint responsivo.

A versão é compatível com a usada no Bacurim UI. A integração do pacote,
dos tokens e das fontes Poppins e Inter está implementada nas issues #7 a #12.
Não copie componentes ou foundations do repositório vizinho. Os imports
públicos e a distribuição por tarball versionado estão documentados.
O CSS público da biblioteca está integrado sem duplicar o reset.

## Resolução de problemas

- Node incompatível: rode `nvm use` antes de instalar ou executar comandos.
- Domínio não abre: confira o hosts, o Traefik e a rede `dev-network`.
- Resposta 502 logo após iniciar: confira os logs; o primeiro `npm ci`
  precisa terminar antes de o servidor receber requisições.
- Dependência nova não encontrada no container: execute
  `docker compose restart web` para reinstalar a partir do lockfile.
- Porta 3000 ocupada no modo local: pare o processo anterior ou use
  `npm run dev -- --port 3001`.

## Validação do Bacurim UI

A integração da issue #7 e suas sub-issues #8 a #12 está pronta para
validação. No ambiente de desenvolvimento, acesse
[bacurim.mamura.test/dev/ui](http://bacurim.mamura.test/dev/ui).

A rota demonstra componentes reais, estados interativos e navegação
responsiva. Em produção retorna 404 por padrão. Leia o
[guia de consumo, atualização e validação](docs/bacurim-ui.md) para conhecer
as convenções e o roteiro de conferência. O tarball versionado em vendor/
permite instalar a aplicação sem um checkout da biblioteca.

## Validação da arquitetura

A issue #13 e suas sub-issues #14 a #19 estabelecem os limites da aplicação.
Consulte [o guia de arquitetura](docs/architecture.md), as ADRs e
[o exemplo executável](docs/architecture-example.md).

Em desenvolvimento, acesse
[bacurim.mamura.test/dev/architecture](http://bacurim.mamura.test/dev/architecture).
Teste o filtro local e os cenários Normal, Lista vazia, Carregamento e Erro.
A rota não depende da API e retorna 404 em produção por padrão.

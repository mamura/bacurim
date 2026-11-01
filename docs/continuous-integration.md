# Integração contínua

## Execução e requisitos

O workflow [CI](../.github/workflows/ci.yml) executa em pushes na master, pull requests direcionados à master e acionamento manual. O fluxo atual é trabalhar diretamente na master; o evento pull_request fica disponível para uma futura mudança de processo.

O job Quality usa Ubuntu 24.04, Node 24 conforme .nvmrc e npm ci com package-lock.json. O cache contém downloads npm, não node_modules nem .next. As ações oficiais são fixadas por SHA; atualizações devem revisar a release e o novo commit. O token tem somente contents:read e checkout não persiste credenciais. Não há deploy, publicação de imagens ou secrets de produção.

O limite é 15 minutos e execuções redundantes da mesma ref são canceladas. Não há filtros de paths: documentação e alterações no lockfile também passam pelo CI. O nome Quality deve permanecer estável.

## Verificações

O pipeline executa os mesmos scripts de npm run check como etapas individuais, na mesma ordem: format:check, lint, check:architecture, typecheck, test e build. As etapas separadas facilitam localizar a falha nos logs do GitHub. Nenhuma usa continue-on-error; qualquer status diferente de zero falha o job.

Vitest usa os setups e transportes controlados do repositório. A integração opcional com Laravel não faz parte do CI. Traefik, Docker, PostgreSQL, Redis e checkouts vizinhos não são necessários.

## Build de produção (#37)

O tarball vendor/bacurim-ui-0.1.0.tgz está versionado e npm ci resolve o pacote sem registry privado ou token adicional. globals.css importa o CSS público da biblioteca e o Tailwind processa os estilos e tokens, com source apontando para o pacote instalado. Fontes e recursos da biblioteca vêm desse pacote; não é preciso fazer download de fontes durante o build.

O build utiliza APP_URL=https://bacurim.example e API_BASE_URL=http://127.0.0.1:9/api/v1, endereço propositalmente indisponível. A página inicial não lê a API e as prévias são dinâmicas, portanto nenhuma conexão é necessária durante a compilação. API_MOCKS_ENABLED e as três flags ENABLE_*_PREVIEW são false no build. A configuração Next também rejeita mocks true em produção.

Não copie .env.local para o runner. Para reproduzir a qualidade local, execute npm ci e npm run check com Node 24. Use ambiente sem overrides locais para reproduzir as variáveis do workflow. O build valida TypeScript, resolução do pacote UI e processamento de CSS; não equivale a um teste visual de navegador.

Referências: [sintaxe de workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node).

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

## Proteção da master e adaptação do processo (#40)

A [regra clássica da master](https://github.com/mamura/bacurim/settings/branch_protection_rules/85668646) bloqueia force push e exclusão da branch, inclusive para administradores. A opção de bypass administrativo está desativada. A configuração foi salva e conferida no GitHub em 01/11/2026, após reautenticação pelo mantenedor. A regra é externa aos arquivos e deve ser recriada se o repositório for migrado.

O repositório é público, portanto o GitHub Free permite aplicar essa proteção. Não há exigência de PR, aprovação de outro usuário ou check prévio ao push. O check de referência é Quality, cuja aprovação deve ser conferida após cada push, conforme CONTRIBUTING.

A decisão do mantenedor de trabalhar exclusivamente na master substitui os exercícios originalmente previstos de PR de teste e bloqueio de merge. Exigir Quality antes de aceitar o commit demandaria primeiro publicar esse commit em outra ref, contrariando esse processo. O CI detecta falhas após o push; ele não impede que um commit inválido alcance a master. A validação local antes do envio continua obrigatória. Se o processo mudar, habilitar Quality obrigatório e revisar o fluxo antes de criar branches ou PRs.

## Evidências de validação

A [execução 41358638103](https://github.com/mamura/bacurim/actions/runs/41358638103), no commit 1d2f916, concluiu com sucesso no runner GitHub: instalação com lockfile, formatação, lint, arquitetura, tipos, 41 testes e build de produção sem API, credenciais ou checkouts vizinhos.

Os pushes sucessivos cancelaram execuções antigas da mesma master, validando a configuração de concorrência. O evento pull_request está configurado, mas não foi exercitado por decisão de trabalhar apenas na master.

Uma cópia isolada criada por git archive, sem .env.local, node_modules ou arquivos de checkouts vizinhos, passou npm ci e npm run check com API indisponível. Nessa cópia, falhas controladas retornaram lint=1, tipos=2, testes=1 e build=1; o build também rejeitou API_MOCKS_ENABLED=true. Os arquivos temporários foram removidos. Nenhuma variável de produção foi necessária.

Falhas controladas de lint, tipos, testes e build foram verificadas localmente em cópia isolada do código versionado; nenhum commit propositalmente quebrado é publicado na master. Esse exercício comprova os códigos de saída dos comandos, mas não representa uma execução remota com falha. O workflow usa a propagação padrão de erros do GitHub Actions, sem continue-on-error.

Não foi tentada uma exclusão ou reescrita real da master para testar as opções de proteção: a evidência é a configuração persistida. Push normal após sua criação confirma a compatibilidade com o fluxo de desenvolvimento.

## Experiência integrada WEB-M1

O workflow E2E adiciona o job Integrated experience em pushes/PRs para master e acionamento manual. Ele usa Node 24, Chromium, PHP 8.3 e PostgreSQL/Redis descartáveis via Compose exclusivo. A referência da API é fixada por SHA. O job é limitado a 20 minutos, solicita apenas contents:read e publica relatório de testes por 7 dias. O ambiente é encerrado com always, inclusive após falha.

Quality continua independente da API. Integrated experience depende do contrato público versionado da API, sem credenciais de aplicação ou acesso ao ambiente de desenvolvimento. Consulte end-to-end.md e web-m1-validation.md. Os dois checks devem ser conferidos após os pushes da rodada; não foi adicionada exigência de PR à master.

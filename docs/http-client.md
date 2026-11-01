# Comunicação HTTP

## Estratégia (#21)

Usar fetch nativo por meio de um cliente compartilhado independente de React.
As features consomem o cliente em serviços/adaptadores, nunca dentro de
componentes de apresentação. O cliente não importa bacurim-ui e não mantém
cache global de respostas ou credenciais.

O servidor Next.js chama a API Laravel diretamente, sem fazer uma chamada
HTTP para um Route Handler da própria aplicação. Configuração, contexto
autorizado e futuras credenciais pertencem à entrada server-only.

O navegador executa interações locais. Quando uma funcionalidade exigir
comunicação autenticada iniciada no cliente, um Route Handler ou Server
Action específico poderá servir de intermediário. Esse intermediário deverá
validar entrada, autorização, sessão e CSRF conforme o contrato adotado.
Não criar um proxy HTTP aberto que aceite destinos, métodos ou headers
arbitrários do navegador.

Uma chamada direta do navegador à API só será adotada com contrato
explícito de origem pública, CORS, cookies e CSRF. Não expor API_BASE_URL,
tokens ou cookies de sessão via NEXT_PUBLIC_* para antecipar essa decisão.
A camada desta issue prepara extensão de headers, sem implementar login,
refresh de token, armazenamento de credenciais ou redirecionamento global.

## Contratos existentes

Fonte local: bacurim-api/docs/http-api.md, rotas e testes de contrato.

- Base da API: /api/v1.
- Recurso: { data: recurso }; coleção: { data: [...] }.
- Paginação: data, links e meta no formato nativo Laravel.
- IDs são strings opacas; valores monetários são decimais em string.
- Propriedades usam snake_case. Datas civis não sofrem conversão de timezone.
- HTTP 204 não contém JSON nem data:null.
- Erros usam application/problem+json (RFC 9457), incluindo code quando definido.
- HTTP 422 inclui errors com campo → lista de mensagens, inclusive nomes com pontos.
- Health técnico: GET /health retorna { status: "ok" }, sem data.

O cliente não desembrulha data automaticamente, não converte IDs ou
decimais em number e não inventa contratos de endpoints financeiros.
Tipos genéricos não substituem validação em runtime; cada serviço valida
os campos que usa. O health check terá um adaptador concreto.

## Segurança e configuração

A URL base e a política de execução são privadas ao servidor e lidas
quando o serviço é chamado. A página inicial e o build não dependem da API.
Não reutilizar uma instância com credenciais de um usuário em outro request.
Qualquer extensão de autenticação será criada por request/contexto.

Dados financeiros usam no-store por padrão. Mutações não terão retry
automático. Erros exibidos na UI terão mensagens locais seguras; HTML,
detalhes de exceções e respostas internas não serão refletidos diretamente.

A conexão ao backend não altera seu contrato nem exige mudanças na API.
Não há SDK público, endpoint financeiro ou fluxo de autenticação nesta etapa.

Ver [ADR 0005](adr/0005-http-communication.md).

## Cliente e configuração (#22)

A entrada @shared/http exporta createHttpClient e os contratos. O adaptador
@shared/http/server cria uma instância por request com API_BASE_URL.
O núcleo aceita um transport fetch injetável, sem alterar o fetch global.

request<TResponse, TBody>(path, options) suporta GET, POST, PUT, PATCH e
DELETE. O resultado contém status, headers e data (possivelmente undefined
para 204 ou corpo vazio). O cliente preserva envelopes e não converte valores.
Os serviços devem validar o modelo recebido; o generic é apenas uma garantia
estática para o código consumidor.

Use caminhos relativos à base, como health ou /examples. Query aceita
URLSearchParams ou objeto de valores escalares/arrays; null e undefined
são omitidos. Filtros Laravel usam chaves como filter[status].
Destinos externos, credenciais embutidas na URL e caminhos que escapem da
base são rejeitados. Redirects HTTP não são seguidos.

Accept inclui JSON e Problem Details; Content-Type JSON é enviado somente
quando há body. O cliente usa no-store e credentials:omit por padrão.
Não há encaminhamento automático de cookies do request do navegador.

No WSL, API_BASE_URL pode usar http://api-bacurim.mamura.test/api/v1.
O Compose usa por padrão http://api-bacurim/api/v1, resolvido na rede Docker.
Para alterar no Compose, defina API_BASE_URL no ambiente do comando ou no
arquivo .env do Compose; esse valor tem precedência sobre .env.local.
Nenhuma conexão é aberta durante o build ou ao renderizar a página inicial.

npm run test:http usa o runner do Node 24 e tipos removíveis. Os imports
relativos do núcleo terminam em .ts, com allowImportingTsExtensions e
noEmit no TypeScript. Os testes também são verificados por typecheck.
A configuração completa de Vitest/React será feita na issue #27.

## Erros (#23)

ApiError distingue HTTP, rede, resposta inválida e configuração.
O status HTTP é a autoridade mesmo quando o corpo informa outro status.
Problem Details é reconhecido pelo media type; code e campos de validação
são normalizados, e extensões desconhecidas são descartadas.

Erros 401/403/404/409/422/429 têm mensagens locais adequadas. Erros internos
usam uma mensagem genérica. Não refletimos title, detail, HTML ou mensagens
de exceções nativas no objeto de apresentação. Para serializar um erro,
use toApiErrorView; não envie a exceção inteira ao cliente.

fieldErrors preserva os nomes de campo, inclusive items.0.label, somente
em respostas 422. Mensagens de validação seguem o contrato público do
backend, com limites de quantidade/tamanho e proteção de chaves especiais.
Não interpolar essas mensagens como HTML. O adaptador não retorna valores
submetidos e não usa texto de erro para decidir regras de negócio.

Falhas de parse em um erro mantêm sua categoria HTTP e mensagem segura.
Uma resposta 2xx com JSON inválido ou conteúdo inesperado é invalid-response.
Cabeçalhos X-Request-ID válidos são preservados quando fornecidos pela API;
nenhum identificador é exigido do backend atual.

## Ciclo de requisição e autenticação futura (#24)

O timeout padrão é 10 segundos e pode ser configurado por API_TIMEOUT_MS
ou por request (1 a 120000 ms). Um único deadline cobre headers dinâmicos,
fetch, leitura do corpo e espera entre tentativas. O AbortSignal do chamador
permite cancelamento, distinguido de timeout e de falhas de rede.
Listeners e timers são removidos ao terminar.

Não há retry por padrão. Um GET pode optar por até duas repetições, somente
em falha de rede ou HTTP 429/502/503/504. Timeout, cancelamento e demais
erros não são repetidos. POST/PUT/PATCH/DELETE nunca são repetidos
automaticamente, mesmo quando retries for informado.

Backoff começa em 200 ms e é limitado a 1 segundo. Retry-After válido é
respeitado: se pedir uma espera maior que o limite, a falha é devolvida sem
tentar antes do prazo. O deadline global também limita essa espera.

Cada chamada envia X-Request-ID seguro (preservado se fornecido ou gerado).
Tentativas da mesma chamada reutilizam esse identificador; respostas podem
fornecer seu próprio ID. O backend atual não precisa ecoar esse header.
Isso é correlação, não chave de idempotência e não substitui deduplicação.

getHeaders é um ponto de extensão assíncrono para autenticação por
request/contexto. Ele recebe método, URL e signal, sem estado global.
Nenhum token é buscado, armazenado, renovado ou encaminhado automaticamente.
Não repasse todos os cookies/headers do navegador à API.

HTTP 401 chega ao serviço como erro tipado; a futura camada de sessão
decidirá quando encerrar a sessão ou solicitar login. Não redirecionar
globalmente dentro do cliente HTTP, nem repetir uma mutação após renovar
credenciais. Cookies, CSRF e refresh pertencem a WEB-M1.

## Mocks explícitos (#25)

Em .env.local, defina API_MOCKS_ENABLED=true e, opcionalmente,
API_MOCK_SCENARIO=success. Reinicie o servidor após alterar a configuração.
Cenários: success, validation, unauthenticated, forbidden, not-found,
conflict, server-error, network e timeout.

O adaptador de servidor carrega o transporte simulado apenas quando
habilitado em development/test. Em produção, a política rejeita os mocks;
next.config.ts também impede build/start com API_MOCKS_ENABLED=true.
Não há interceptação global de fetch, endpoint mock público ou flag pública.

Os testes podem injetar createApiMockFetch diretamente, sem depender de
env, rede, React ou API real. Cada instância é isolada e descarta seu
estado ao terminar o teste. A futura configuração Vitest poderá reutilizar
essas fixtures/transportes.

health representa o contrato real. examples existe apenas no transporte
de testes para demonstrar os envelopes, IDs/decimais, paginação e 204;
não é um endpoint Laravel ou uma funcionalidade financeira implementada.
Erros simulados são Responses reais processadas pelo mesmo cliente HTTP.

Para usar a API real, desative API_MOCKS_ENABLED e configure API_BASE_URL.
Nenhum componente ou serviço muda de import; o mesmo adaptador passa a usar
fetch real. createServerApiClient é assíncrono por carregar o mock sob demanda.

## Validação e health check (#26)

O serviço @features/api-status/server lê health pelo adaptador HTTP e
valida { status: "ok" } em runtime. Retorna apenas um modelo seguro para
apresentação, incluindo fonte real/mock e identificador quando disponível.
Não testa o banco ou Redis, não envia dados financeiros e não exige login.

Em desenvolvimento, abra
[bacurim.mamura.test/dev/http](http://bacurim.mamura.test/dev/http).
A rota é isolada, noindex/nofollow e bloqueada antes do streaming em
produção, salvo ENABLE_HTTP_PREVIEW=true. Cada nova leitura é iniciada
por navegação de documento; não há polling nem chamadas HTTP no componente.
A URL privada da API e os cabeçalhos não são serializados para a página.

### Comandos

```bash
npm run test:http
npm run check:architecture
npm run typecheck
npm run build
```

test:http executa os contratos sem depender da API; o teste contra Laravel
real é ignorado quando API_INTEGRATION_URL não está explicitamente definido.
Para executar esse contrato na rede do ambiente Docker:

```bash
docker compose exec -T -e API_INTEGRATION_URL=http://api-bacurim/api/v1 web npm run test:http:integration
```

Fora do container, use uma URL acessível do ambiente onde o Node executa:

```bash
API_INTEGRATION_URL=http://api-bacurim.mamura.test/api/v1 npm run test:http:integration
```

A integração faz somente GET health, POST health (405) e GET de um caminho
ausente (404). Não cria recursos nem altera dados da aplicação.

### Cobertura

- Métodos, corpo JSON, headers, query e filtros com caracteres especiais.
- Envelopes, IDs e decimais preservados, 201/Location e 204 sem JSON.
- Problem Details e validação, inclusive campos aninhados.
- Erros HTTP, rede, resposta inválida, configuração, timeout e cancelamento.
- Descarte de detalhes internos e DTOs de apresentação serializáveis.
- Cancelamento prévio, fetch/body bloqueados e espera entre retries.
- Retry opt-in de leitura, limite de tentativas, Retry-After e ausência de retry de mutações.
- Extensão de headers por contexto e aplicação do timeout privado.
- Isolamento de mocks, ativação explícita e rejeição em produção.
- Transporte fetch real com servidor HTTP efêmero de teste.
- Contrato do health/404/405 da API real quando habilitado.

Os testes HTTP não verificam regras financeiras ou autenticação ainda
inexistente. A configuração completa de Vitest, React Testing Library,
lint e formatação pertence à issue #27.

### Roteiro local

1. Abra /dev/http com API_MOCKS_ENABLED=false e a API em execução.
2. Confira Fonte: API real e API respondeu corretamente.
3. Em .env.local, habilite API_MOCKS_ENABLED=true e escolha um cenário
   da lista; reinicie o frontend.
4. Confira que a página identifica a fonte como mock e apresenta os estados
   de sucesso, HTTP 422/401/403/404/409/500, rede e timeout.
5. Desative os mocks e reinicie para restaurar o acesso à API real.

O cenário timeout usa o deadline configurado; para uma conferência rápida
pode ajustar API_TIMEOUT_MS temporariamente. Nunca informe credenciais
reais nas fixtures ou copie cookies para esse roteiro.

### Variáveis

| Variável privada | Padrão | Efeito |
| --- | --- | --- |
| API_BASE_URL | http://api-bacurim.mamura.test/api/v1 | Base HTTP(S) no servidor |
| API_TIMEOUT_MS | 10000 | Deadline total, 1 a 120000 ms |
| API_MOCKS_ENABLED | false | Opt-in literal true apenas em development/test |
| API_MOCK_SCENARIO | success | Cenário usado somente com mocks habilitados |
| ENABLE_HTTP_PREVIEW | false em produção | Libera /dev/http somente com true; dev já permite |

O Compose substitui apenas a URL padrão pela resolução interna
http://api-bacurim/api/v1. Os demais valores podem ser configurados em
.env.local; nenhuma variável é pública. Mudanças em opções do Compose
exigem docker compose up -d; mudanças em .env.local exigem reiniciar web.

Na conferência desta entrega, a suíte completa passou também dentro do
container com API_INTEGRATION_URL habilitada, e a prévia mostrou a API real
e um mock HTTP 422 no navegador, sem detalhes internos. O layout foi
conferido em desktop e largura móvel de 390 px.

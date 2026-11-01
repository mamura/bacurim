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

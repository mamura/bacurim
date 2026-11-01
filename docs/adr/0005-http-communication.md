# ADR 0005 — Fetch nativo e serviços de integração

Status: aprovada pelo usuário após validação da issue #20.

## Contexto

Next.js e o navegador já oferecem fetch. O backend tem contratos JSON e
Problem Details definidos, mas autenticação e endpoints financeiros
ainda serão implementados. A aplicação deve funcionar com a API indisponível.

## Decisão

Adotar cliente HTTP tipado, sem dependência de React ou de biblioteca de UI.
Separar núcleo reutilizável, adaptador server-only, contratos e mocks.
Usar integração direta servidor → Laravel para leituras no servidor.
Introduzir um intermediário específico apenas para uma necessidade real
de comunicação iniciada no navegador, com regras de sessão e CSRF explícitas.

Mocks serão transportes injetados, sem sobrescrever globalThis.fetch.
O modo mock exigirá opt-in e será rejeitado em produção. Os testes de HTTP
usarão inicialmente o runner nativo do Node 24, sem antecipar a configuração
completa do Vitest e testes React da issue #27.

## Consequências

Sem dependência de Axios, cache remoto ou estado global prematuros.
Os mesmos serviços podem ser exercitados com respostas HTTP simuladas.
A autenticação futura não é resolvida por esta ADR e não deve ser simulada
por um token global ou pelo encaminhamento de todos os cookies/headers.

Detalhamento: [comunicação HTTP](../http-client.md).

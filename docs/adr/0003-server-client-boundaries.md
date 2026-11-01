# ADR 0003 — Composição no servidor e interatividade no cliente

Status: adotada na implementação da issue #13; validação do usuário pendente.

## Contexto

App Router e o pacote bacurim-ui têm responsabilidades diferentes.
Dados privados não podem alcançar o navegador por uma entrada compartilhada.

## Decisão

Manter páginas/layouts no servidor e ilhas interativas no cliente.
Separar as entradas index, server e types quando uma feature precisar
delas. Proteger configuração e serviços privados com server-only.
O servidor entrega apenas modelos serializáveis de apresentação.

## Consequências

As features não dependem da composição das rotas. Eventos não podem ser
passados como funções comuns de servidor para componentes cliente.
O compilador Next.js rejeita imports server-only pelo grafo cliente.
A biblioteca de UI permanece desacoplada de sessão e dados financeiros.

Detalhamento: [fronteiras de execução](../rendering-boundaries.md).

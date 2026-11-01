# Estado da aplicação (#16)

## Fonte de verdade

| Tipo de estado | Ferramenta inicial | Exemplo |
| --- | --- | --- |
| Local e transitório | useState/useReducer no menor componente cliente | Diálogo aberto, formulário, Sidebar recolhida |
| Derivado | Cálculo puro; useMemo apenas se útil | Lista filtrada e contagem a partir dos mesmos itens |
| Navegável/compartilhável | URL e searchParams | Paginação, período, ordenação e filtro persistente de uma listagem |
| Compartilhado na mesma árvore | Elevar estado; Context restrito ao fluxo se necessário | Contexto visual do App Shell |
| Remoto | Serviço da feature, servidor como origem | Dados de sessão e respostas da API |

Um filtro de demonstração descartável pode ser local; filtros de uma
listagem real devem priorizar a URL quando fizer sentido preservar ou
compartilhar a navegação. A URL não contém credenciais ou dados sensíveis.

Não copie props para useState para mantê-las sincronizadas por useEffect.
Guarde apenas o que o usuário pode mudar; derive o restante. Um formulário
pode ter um rascunho local deliberadamente separado dos dados recebidos.

## Context e bibliotecas

Context não substitui um cache de requisições. Use-o quando vários
descendentes precisam do mesmo estado coeso e props já prejudicam a
composição. Mantenha o provider perto dos consumidores e separe contextos
de responsabilidades diferentes. Não crie um provider global vazio.

Não adicionar Redux, Zustand, SWR ou TanStack Query nesta etapa.
Reavaliar uma biblioteca de estado remoto quando houver polling, paginação
cliente, deduplicação, invalidação ou atualizações otimistas repetidas que
exijam uma implementação própria significativa. Registrar a escolha em ADR.
Até então, use as capacidades do React e do App Router.

## Dados remotos, cache e sincronização

A camada HTTP é da issue #20. Cada feature adaptará os contratos recebidos
em modelos de apresentação, sem manter outra cópia global da resposta.

Para dados financeiros/autenticados, exigir política explícita. A política
inicial prevista é fetch sem cache persistente (cache: no-store). Não usar
cache compartilhado entre usuários ou tenants. Qualquer cache futuro deve
incluir a identidade do tenant e os parâmetros relevantes na chave, ter
expiração/invalidação definida e ser limpo ao encerrar ou trocar a sessão.

O projeto não habilita Cache Components e não introduz uma camada própria
de cache. React.cache, quando necessário, deduplica apenas dentro da
requisição/renderização; não é armazenamento global de dados de usuário.

Depois de uma mutação confirmada pela API:

1. Exiba o resultado com base na resposta real; não confirme sucesso antes.
2. Atualize a fonte consumida pela feature.
3. Para leituras sem cache no servidor, router.refresh pode obter uma nova
   renderização. Ele não invalida por si só o cache persistente de fetch.
4. Se futuramente houver cache explícito, invalide tags/chaves afetadas
   antes de atualizar a visão; não invalide toda a aplicação.
5. Preserve o rascunho em caso de erro e evite duplicar operações financeiras.

Não há atualização otimista de pagamentos, recebimentos ou transferências
nesta fundação. Cancelamento, retry e contratos de erro serão tratados na
camada de comunicação. Não implemente regras de conciliação no estado local.

## Validação na estrutura atual

A prévia de UI mantém estado por instância: Sidebar, campo, seleção,
loading e feedback. O exemplo arquitetural aplica o mesmo princípio para
um filtro local e deriva a lista visível a partir de props do servidor.
Nenhum desses dados é persistido nem necessita de um estado global.

Referências:
[Server e Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components),
[fetch e cache](https://nextjs.org/docs/app/api-reference/functions/fetch).

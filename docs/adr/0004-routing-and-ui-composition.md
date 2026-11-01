# ADR 0004 — Rotas leves e composições de estados de página

Status: adotada e validada pelo usuário na issue #13.

## Contexto

Os exemplos técnicos precisam permanecer isolados das funcionalidades
futuras, com URLs estáveis e estados acessíveis. Os componentes visuais
já existem no Bacurim UI.

## Decisão

Agrupar rotas técnicas em (development), mantendo seus caminhos /dev.
Usar convenções App Router para loading e error. Compartilhar somente a
composição neutra dos estados loading/error/empty, construída a partir do
pacote público. As features controlam seus estados de negócio e apresentação.

## Consequências

A organização de arquivos pode evoluir sem renomear URLs. O grupo técnico
não antecipa autenticação, shell definitivo ou telas financeiras.
Mensagens de erro e caminhos de recuperação ficam consistentes, sem
duplicar primitivos ou incluir lógica HTTP nos componentes compartilhados.

Detalhamento: [rotas e composição](../routing-and-ui.md).

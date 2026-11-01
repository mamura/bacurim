# ADR 0001 — Organização por funcionalidades

Status: adotada na implementação da issue #13; validação do usuário pendente.

## Contexto

O MVP evolui por capacidades financeiras, mas a estrutura da API e as
seções da navegação não correspondem necessariamente a módulos frontend.
O domínio e a arquitetura de informação exigem uma visão integrada de
registros econômicos, compromissos e realizações.

## Decisão

Adotar app para composição de rotas, features para capacidades coesas e
shared para código neutro efetivamente compartilhado. Proibir imports entre
features; integração ocorre pela composição das páginas. Criar diretórios
somente ao adicionar código com responsabilidade concreta.

Cada feature expõe entradas públicas pequenas. Serviços de servidor e
componentes cliente têm entradas separadas para preservar a fronteira de
execução. A biblioteca bacurim-ui continua sendo a origem dos componentes
e tokens visuais.

## Consequências

As funcionalidades podem evoluir sem importar implementações vizinhas.
Alguma composição explícita em rotas é intencional. Necessidades futuras de
integração ou compartilhamento podem motivar uma nova ADR; não justificam
introduzir agora uma camada abstrata de domínio no frontend.

# ADR 0002 — Estado local e política explícita de dados remotos

Status: adotada na implementação da issue #13; validação do usuário pendente.

## Contexto

Ainda não há endpoints financeiros integrados. As interações existentes
têm estado local simples. Dados de empresas distintas exigem isolamento.

## Decisão

Usar estado do React no menor escopo possível e URL para estados
navegáveis. Context atende compartilhamento coeso dentro de uma árvore,
sem se tornar cache HTTP. Não instalar uma biblioteca de estado global
ou remoto sem necessidade demonstrada.

Planejar leituras financeiras sem cache persistente por padrão. Cache
futuro exige chave com tenant, política de expiração e invalidação após
mutações. Serviços encapsulam integração; componentes exibem modelos.

## Consequências

A fundação permanece pequena e evita duplicação de fontes de verdade.
Uma biblioteca de queries pode ser introduzida quando os fluxos reais
justificarem; a decisão não exige alterar os componentes do Bacurim UI.

Detalhamento: [estratégia de estado](../state-management.md).

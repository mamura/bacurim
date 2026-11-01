# Arquitetura frontend

A issue #13 estabelece uma organização por funcionalidades. O frontend
apresenta informações, conduz interações e valida a experiência. Regras
financeiras e autorização permanecem na API. Não reproduzimos a Clean
Architecture do backend nem criamos pastas para funcionalidades inexistentes.

## Áreas e limites (#14)

Referências de produto: Product Definition/09 - MVP Features.md,
Product Definition/10 - Domain Model.md e Product Design/12 - Information
Architecture.md, disponíveis na pasta compartilhada do projeto.

| Área candidata | Responsabilidade | Limite |
| --- | --- | --- |
| authentication | Identificação, sessão e usuários autorizados | Sem regras financeiras; implementação em WEB-M1 |
| organizations | Dados da empresa e contexto do tenant | Uma empresa por tenant no MVP; sem alternância global entre tenants |
| financial-accounts | Contas e informações de disponibilidade | Não recalcula saldos ou movimentações no navegador |
| categories | Classificação financeira | Vocabulário comum a lançamentos, sem copiar regras da API |
| financial-transactions | Registros, compromissos e realizações apresentados em conjunto | A pagar e A receber são filtros, não features independentes |
| financial-planning | Parcelamentos, recorrências e projeção de 12 meses | Cálculo e regras pertencem à API |
| financial-reporting | Resultado, fluxo de caixa e sínteses de análise | Mantém distinção entre competência, caixa e retiradas |
| data-import | Seleção, mapeamento, prévia e validação de arquivos | Ação dentro do Financeiro; processamento oficial na API |
| onboarding | Orientação e configuração inicial | Compõe capacidades, sem duplicar suas implementações |

Esses nomes são candidatos técnicos, não uma árvore de diretórios já criada
nem uma cópia da navegação. Visão Geral pode compor resumos no nível de rota.
Financeiro, Análises, Projeção e Configurações continuam sendo áreas da
experiência, conforme o documento de arquitetura de informação.

## Direção das dependências

- app pode compor features, shared e componentes públicos de bacurim-ui.
- Cada feature possui seus componentes, hooks, serviços e modelos.
- Uma feature não importa outra feature, nem arquivos de app.
- shared não conhece features nem app.
- bacurim-ui permanece independente e é consumido pelos exports públicos.
- Configuração privada e serviços de servidor usam server-only.

A composição entre funcionalidades ocorre em app: passe dados mínimos por
props e callbacks no mesmo ambiente, ou defina um contrato de integração
quando uma necessidade real aparecer. Não adote imports profundos, bus
global de eventos ou contexto global para contornar uma dependência proibida.

Promova código a shared quando tiver responsabilidade neutra e consumidores
reais em áreas diferentes. Sem essa evidência, mantenha-o na funcionalidade.
Não mova tipos de domínio para shared apenas para liberar um import.
Contratos públicos devem ser pequenos; modelos internos não são um SDK.

A separação entre competência e caixa é semântica de produto. Os módulos
consomem contratos da API sem reconstruir cálculos de saldo, realização,
projeção, isolamento de tenant ou autorização.

Veja [ADR 0001](adr/0001-feature-based-architecture.md).

# Exemplo arquitetural e verificação de limites (#19)

## Fluxo executável

Acesse [a prévia de arquitetura](http://bacurim.mamura.test/dev/architecture)
em desenvolvimento. Ela usa dados técnicos em memória, sem API, persistência
ou cálculo financeiro.

1. A rota verifica a flag privada e lê searchParams.
2. A entrada pública server chama o serviço da própria feature.
3. O serviço trata a entrada externa e entrega modelos simples serializáveis.
4. O componente cliente recebe os itens por props.
5. O hook guarda somente o filtro e deriva os itens visíveis.
6. A UI usa Table, Input, Button, Badge e Card de bacurim-ui.
7. Os estados loading/error/empty vêm das composições em shared/ui.

Os arquivos da feature foundation-demo demonstram responsabilidades reais,
sem interfaces vazias, repositórios genéricos ou dependências financeiras.
A feature ui-preview permanece separada e não é importada pelo exemplo.

## Cenários para validar

| Ação | Resultado esperado |
| --- | --- |
| Abrir Normal | Três itens recebidos do serviço |
| Filtrar por roteamento | Um item, sem nova leitura remota |
| Filtrar por inexistente | Empty state de filtro, com ação para limpar |
| Clicar Mostrar todos os itens | Lista restaurada |
| Abrir Lista vazia | Empty state de leitura bem-sucedida sem dados |
| Abrir Carregamento | Skeleton/status durante o atraso de demonstração, depois lista |
| Abrir Erro de leitura | Mensagem segura, retry e caminho de recuperação |
| Reabrir exemplo sem erro simulado | Navegação de documento para o cenário normal |
| Abrir prévia do Bacurim UI | Componentes aprovados continuam disponíveis |

O atraso de 900 ms e a exceção simulada existem somente no serviço técnico.
No cenário de erro, Tentar novamente repete a leitura e continuará falhando
enquanto a URL contiver scenario=error. A ação Reabrir usa uma navegação de
documento deliberada para remover o cenário e reiniciar a fronteira de erro
do mesmo segmento. Não há retry de uma operação financeira.

As prévias são dinâmicas, com noindex/nofollow. Em produção:

- /dev/ui exige ENABLE_UI_PREVIEW=true.
- /dev/architecture exige ENABLE_ARCHITECTURE_PREVIEW=true.
- Sem suas flags, ambas retornam 404. A página inicial continua funcionando.
- Não configure essas flags para uma disponibilização normal aos usuários.

Para uma conferência técnica de produção local:

```bash
npm run build
ENABLE_UI_PREVIEW=true ENABLE_ARCHITECTURE_PREVIEW=true npm start
```

## Verificador executável

```bash
npm run check:architecture
npm run typecheck
npm run build
```

O verificador usa a resolução de módulos do TypeScript e os aliases reais.
Ele analisa imports estáticos, reexports e imports dinâmicos com string
literal em todos os módulos TypeScript de src/.

Ele rejeita:

- shared dependendo de app ou features;
- uma feature dependendo de app ou de outra feature;
- acesso externo às entradas privadas de uma feature;
- imports internos do pacote bacurim-ui;
- ciclos no grafo local de imports;
- dependências server-only transitivamente alcançadas por um módulo cliente;
- aliases/imports TypeScript locais que não resolvem.

As entradas públicas de uma feature são index.ts, server.ts e types.ts,
criadas somente quando necessárias. Um módulo interno usa imports relativos.
A verificação de CSS fica a cargo do bundler; imports públicos de styles.css
são permitidos. O script não substitui o compilador Next.js, lint, autorização
da API ou análise de código que construa imports dinamicamente. Evite essa
construção; os imports de aplicação devem ser estaticamente rastreáveis.

Foram conferidos também casos negativos temporários: import entre features,
entrada privada, ciclo e módulo server-only no cliente. Todos foram rejeitados
e os arquivos temporários foram removidos. Não há suíte completa de testes
nesta etapa; sua configuração pertence à issue de qualidade automatizada.

## Adicionar uma funcionalidade

Crie apenas o código necessário em features/<nome>. Defina as entradas
públicas antes de compor a rota. Dados privados ficam na entrada server;
estado interativo, no componente/hook cliente; tipos neutros, em model.
Mantenha a leitura de contratos HTTP na camada de serviços que será
implementada na issue #20. Não copie as fixtures técnicas para produção.

Valide os limites, tipos e build. Commit e push na master por sub-issue;
a issue principal e suas sub-issues permanecem abertas até aprovação local.

## Documentação de decisão

- [Organização e áreas](architecture.md)
- [Estado e cache](state-management.md)
- [Servidor e cliente](rendering-boundaries.md)
- [Rotas e UI](routing-and-ui.md)
- [ADR 0001](adr/0001-feature-based-architecture.md)
- [ADR 0002](adr/0002-state-management.md)
- [ADR 0003](adr/0003-server-client-boundaries.md)
- [ADR 0004](adr/0004-routing-and-ui-composition.md)

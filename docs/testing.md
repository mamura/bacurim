# Estratégia de testes

Os testes ficam em `tests/`, separados do código entregue. Use `*.test.ts` para lógica e serviços e `*.test.tsx` para componentes. Os contratos HTTP existentes usam `*.test.mts`.

## Escolha do nível

- Unitário: funções puras e regras de transformação, com entradas válidas, limites e entradas inválidas.
- Hook: `renderHook` e `act` quando o comportamento próprio justificar um teste; valide resultados observáveis e mudanças de argumentos.
- Componente: React Testing Library, consultas por papel/nome acessível e interações com `userEvent`. Verifique props, carregamento, vazio, erro e recuperação quando aplicáveis.
- Integração: combine serviço, cliente HTTP e transporte controlado; mantenha os DTOs e erros reais. Não substitua o próprio objeto sob teste por mocks.
- Fluxos de navegação e Server Components assíncronos completos ficam para futuros testes E2E. Serviços extraídos são testados diretamente em Node.

Teste os contratos da aplicação com os componentes reais do Bacurim UI. Comportamentos internos da biblioteca pertencem ao repositório dela. Evite snapshots extensos, classes CSS, seletores de implementação e contagens arbitrárias de chamadas.

## Ambientes e isolamento

O projeto Vitest `ui` usa jsdom, JSX automático, os aliases do aplicativo e jest-dom. A limpeza do DOM acontece após cada teste. O projeto `server` usa Node e neutraliza apenas o marcador de compilação `server-only` nesse ambiente. O projeto UI conserva o marcador original; a verificação de arquitetura e o build Next.js validam as fronteiras de produção.

Use mocks pequenos, explícitos e locais ao cenário. Restaure globals, ambiente e spies após cada teste; não compartilhe estado mutável nem dependa da ordem de execução. Não use `test.concurrent` com mocks de globals ou variáveis de ambiente. Fixtures devem representar contratos, preservando IDs e decimais como strings.

Os testes padrão não dependem da API real. A integração opcional com Laravel exige `API_INTEGRATION_URL` e usa comando separado. Nunca acrescente credenciais reais às fixtures.

## Formulários e validação

Ao adicionar um formulário, teste digitação, envio, bloqueio durante envio, validação local e exibição dos erros 422 por campo. Verifique recuperação de falhas e preservação dos dados inseridos. Não replique regras financeiras do backend no frontend sem contrato aprovado.

## Execução

`npm test` executa uma vez; `npm run test:watch` acompanha alterações. Um teste que falha deve encerrar o comando com código diferente de zero. Antes de enviar alterações, execute também os controles de arquitetura, tipos e build documentados no README.

Referências: [Vitest no Next.js](https://nextjs.org/docs/app/guides/testing/vitest), [projetos Vitest](https://vitest.dev/guide/projects), [consultas acessíveis](https://testing-library.com/docs/queries/about/).

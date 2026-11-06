# Validação integrada WEB-M1

## Ambiente isolado (#76)

Os testes Playwright usam frontend de produção em http://127.0.0.1:3100 e API Laravel real em http://127.0.0.1:8011. O Compose tests/e2e/compose.yml usa projeto exclusivo bacurim-web-e2e, PostgreSQL e Redis descartáveis em tmpfs, sem portas de banco/cache publicadas. Não altera o Compose ou os dados de desenvolvimento.

A fonte da API é montada somente para leitura e copiada para /app temporário, excluindo .env, storage e caches locais. Dependências do backend são copiadas do vendor local quando existente ou instaladas pelo composer.lock. Nenhuma APP_KEY de desenvolvimento é reutilizada. Sessão real usa banco, cookie HttpOnly exclusivo e middleware CSRF ativo. O Redis guarda os limites reais de autenticação.

Fixtures e comandos de reset/expiração/revogação exigem BACURIM_E2E=true, APP_ENV=testing, host database e banco bacurim_test, além do host Redis cache. Não são endpoints de produto. As contas @e2e.test e sua senha conhecida existem apenas nesse ambiente descartável; não podem ser criadas em produção.

## Execução

Requisitos: Node 24, Docker Compose e checkout da API-M1 em ../bacurim-api.

```sh
npm ci
npx playwright install --with-deps chromium
npm run e2e:up
npm run test:e2e
npm run e2e:down
```

Para usar outra localização, defina BACURIM_API_PATH com caminho absoluto da API. A imagem padrão usa PHP 8.3 oficial e instala extensões necessárias. No workspace que já possui a imagem bacurim-api, BACURIM_E2E_PHP_BASE=bacurim-api npm run e2e:up reaproveita esse runtime; dados e configuração continuam isolados.

Cada teste restaura fixtures e limites somente nos containers exclusivos. Execute com um worker e sem outra suíte usando esse projeto simultaneamente. e2e:down remove apenas o projeto de testes. O frontend é iniciado e encerrado pelo Playwright; uma porta 3100 ocupada falha a inicialização.

A prontidão usa a mensagem Ready in do Next.js, com timeout. Isso evita depender de uma resposta imediata de porta fechada no WSL. Testes e2e não entram no Vitest padrão. Playwright verifica desktop 1440×900 e mobile 390×844, com cookies/contextos isolados e trace somente em falhas.

## Acessibilidade e responsividade (#80)

Chromium desktop 1440×900 e mobile 390×844 validam login, seleção, shell, Meu acesso e ausência de organização. A auditoria axe utiliza wcag2a, wcag2aa e wcag21aa; todos os cenários auditados passaram sem violações reportadas. Cada estado final possui um h1, e scrollWidth não ultrapassa a largura do viewport.

O login foi operado por teclado; a navegação móvel foi aberta, fechada com Escape e devolveu foco ao acionador. Os testes verificam labels, controles essenciais e mensagens de formulário. Capturas desktop/mobile são geradas no diretório de resultados para conferência visual.

A validação identificou contraste insuficiente do token secundário em textos pequenos. A composição da aplicação passou a usar o token de texto primário nesses pontos, inclusive captions da Sidebar, e a variante branca do botão Sair sobre o Header. Não foram alteradas as cores ou os componentes do pacote vendor.

Os wrappers de título do tarball UI atual não encaminham aria-level. Os títulos de página/estado agora usam headings HTML semânticos na composição, mantendo os componentes de layout e tokens do Design System.

A avaliação é limitada aos fluxos e viewports descritos, não uma certificação completa de conformidade. Alguns labels internos de navegação do tarball atual permanecem em inglês; o Menu da aplicação e as ações de negócio estão identificados em português.

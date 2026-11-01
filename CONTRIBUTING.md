# Contribuindo com o frontend

## Trabalho por issue

1. Confirmar escopo, critérios e dependências da issue principal e suas sub-issues.
2. Trabalhar diretamente na master, conforme decisão do mantenedor. Revisar o estado local antes de atualizar; nunca descartar alterações de outra pessoa.
3. Implementar uma sub-issue por vez com testes de comportamento e documentação pertinentes.
4. Executar npm run check e revisar o diff. Criar commit e enviar à master antes de iniciar a próxima sub-issue.
5. Conferir o job Quality no commit enviado. Corrigir falhas por novo commit, sem reescrever histórico publicado.
6. Ao concluir o grupo, apresentar o resultado para validação do mantenedor. Manter as issues abertas até essa validação.
7. Após aprovação, fechar a issue principal e as sub-issues como completed e seguir para o próximo grupo.

A pasta bacurim-web corresponde ao repositório mamura/bacurim. Não adicionar arquivos da API, da biblioteca UI ou da infraestrutura da pasta pai por engano.

## Commits

Use `tipo: descrição objetiva (#issue)` em inglês. Tipos usuais: feat, fix, test, docs, refactor, chore e ci. Exemplo: `ci: validate production build (#37)`. Explique motivação e validação no corpo quando necessário. Não use `Closes` ou `Fixes` nos commits deste fluxo, pois isso poderia fechar a issue antes da validação humana.

## Revisão e testes

Revise escopo, arquitetura, fronteiras Server/Client, contrato HTTP, estados de interação e acessibilidade. Considere precisão financeira, isolamento por tenant e dados sensíveis quando aplicável. A API aplica as regras de negócio; validações no frontend melhoram a experiência.

Use a [estratégia de testes](docs/testing.md). Novos comportamentos devem ter testes relevantes de sucesso, falha e recuperação. Mudanças documentais não exigem testes artificiais, mas devem passar formatação e revisão dos links. Não copie componentes internos do Bacurim UI ou replique sua suíte.

## Pull requests

O fluxo atual dispensa branches e PRs. O template existe para eventual colaboração futura e o workflow aceita PRs para master. Se esse processo for retomado, use `Refs #N` para relacionar issues preservando o fechamento após validação. Exigir PR ou outra branch depende de mudança explícita do processo pelo mantenedor.

## Definition of Done

- Critérios da issue e sub-issues atendidos, com limitações reais identificadas.
- Testes pertinentes e npm run check aprovados.
- Documentação, contratos e ADRs atualizados quando necessário.
- Diff revisado, sem segredos, dados locais ou alterações incidentais.
- Cada sub-issue commitada e publicada na master; Quality aprovado no commit atual.
- Resultado apresentado e validado pelo mantenedor.
- Issues encerradas somente após validação.

A implementação pronta para validar ainda aguarda os dois últimos itens. As convenções de mensagens, revisão e documentação seguem a API; o fluxo de branches/PRs dela não se aplica ao frontend por decisão do mantenedor.

Consulte [integração contínua](docs/continuous-integration.md) e [documentação técnica](docs/README.md).

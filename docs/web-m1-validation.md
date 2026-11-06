# Validação da WEB-M1

A rodada implementa as seis tarefas principais e suas 34 sub-issues na master. As issues permanecem abertas aguardando a validação única do mantenedor.

| Tarefa | Escopo implementado                                     | Sub-issues |
| ------ | ------------------------------------------------------- | ---------- |
| #42    | Login, formulário, CSRF, integração e navegação segura  | #43–47     |
| #48    | Identidade, restauração, barreira privada e logout      | #49–53     |
| #54    | Zero/um/múltiplos vínculos, seleção, troca e isolamento | #55–60     |
| #61    | Application Shell, Sidebar, Header e composição         | #62–67     |
| #68    | Papéis empresariais e apresentação de acesso            | #69–74     |
| #75    | Contratos reais, jornadas E2E e acessibilidade          | #76–81     |

## Evidências e execução

Em 06/11/2026, a execução local completa aprovou 118 testes Vitest e 48 cenários E2E, além de formatação, lint, arquitetura, tipos e build de produção. Os cenários axe auditados passaram sem violações reportadas nas regras selecionadas.

npm run check verifica formatação, lint, arquitetura, tipos, Vitest e build. npm run test:e2e verifica as jornadas reais em Chromium desktop/mobile após npm run e2e:up. O [guia E2E](end-to-end.md) descreve isolamento, fixtures e comandos de encerramento.

A suíte integrada cobre sessão/CSRF/cookies, identidade, logout, credenciais inválidas, usuário inativo, limite real de login, expiração, recuperação de rede, zero/um/múltiplas empresas, mudança de papel entre empresas, revogação e recursos estrangeiros com 403/404. Os estados acessíveis são auditados com axe e conferidos por teclado, foco e overflow.

O CI possui Quality e Integrated experience. O segundo faz checkout da API no commit bf1aa1d165585817be9da11c8e31ce0f91265adc para fixar o contrato validado. Atualizações dessa referência precisam de nova execução integrada. Nenhuma credencial de produção ou serviço de desenvolvimento é necessário.

## Roteiro para a validação do mantenedor

Acesse /login no ambiente normal configurado para sua API e utilize uma identidade já cadastrada. Conferir login, atualização da página, Meu acesso, navegação móvel, logout e retorno a URL privada. Para cenários com contas controladas, use exclusivamente o ambiente E2E e suas fixtures documentadas.

- Standard/consultant com um vínculo: entrada direta.
- Sem vínculo: ausência de empresa, nova consulta e logout.
- Consultor com múltiplos vínculos: seleção e troca; cada empresa mostra seu papel.
- Vínculo revogado/ID não autorizado: mensagem de indisponibilidade sem dados estrangeiros.
- Rede indisponível: recuperação, sem declarar logout confirmado.

As contas artificiais são apenas do banco descartável: owner/admin/member/viewer/empty/consultant/consultant-empty/consultant-one/inactive @e2e.test, com senha E2e-only-password!42. Não representam contas de desenvolvimento ou produção.

## Limites e liberação dos módulos futuros

Não há cadastro público, recuperação de senha, promoção a consultor, gestão completa de membros ou operações financeiras nesta milestone. Apenas Início e Meu acesso são navegação operacional. As capacidades são apresentação; a API continua autorizando cada operação.

Os testes de navegador usam Chromium em duas resoluções; não constituem cobertura de todos os navegadores ou auditoria formal de segurança/acessibilidade. Riscos residuais de domínio comum dos cookies, HTTPS e origem autorizada estão no guia de autenticação. Labels internos em inglês pertencem ao tarball UI atual.

Antes de iniciar um módulo financeiro, manter os contratos da API, usar PageContent, authenticatedRequest e useOrganizationRequests/escopo por organização, incluir a permissão já aprovada e testar sucesso/falha/precisão e troca de contexto. Nenhum dado financeiro deve ser serializado por Server Components sem verificação de sessão equivalente no servidor.

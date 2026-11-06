# Contexto empresarial (#54–60)

GET /api/v1/auth/organizations retorna data com public_id, name, role e membership_public_id. Não há status na representação: o backend já filtra organizações e vínculos ativos. Nenhum endpoint de seleção foi criado.

A identidade e a lista são independentes. Zero organizações mostra ausência de vínculo, com nova consulta e logout. Um vínculo entra diretamente para standard ou consultant. Múltiplos vínculos abrem seleção somente para consultant; múltiplos para standard indicam contrato inconsistente e falham de forma segura. Isso não substitui a regra de cardinalidade da API.

O caminho /app/organizations/:public_id representa o contexto. Na entrada direta e na troca, a lista é revalidada antes de apresentar conteúdo. IDs externos à lista não são contexto válido e mostram mensagem genérica de indisponibilidade. Um link antigo de organização revogada não concede acesso. A escolha não é armazenada como credencial nem enviada a um endpoint de seleção.

OrganizationProvider é recriado por revisão de sessão/identidade. Revalidação limpa a lista antes de carregar; logout e invalidação desmontam o contexto. Cada rota empresarial passa por OrganizationBoundary, que também impede flashes de conteúdo durante validação.

OrganizationRequestScope prefixa o identificador explícito nas operações empresariais e AbortController encerra requisições ao desmontar/trocar contexto. Respostas depois do encerramento são descartadas. useOrganizationRequests fornece o escopo validado às futuras features. Não há cache financeiro nesta milestone; futuros caches precisam incluir public_id da organização e a revisão do contexto em sua chave. Não manter dados empresariais em singleton global.

401 invalida identidade; 403/404 empresarial revalidam os vínculos sem declarar logout. Papéis desconhecidos são representados como unknown e não poderão conceder capacidades. O perfil consultant não concede autorização adicional.

A suíte cobre zero/um/múltiplos vínculos, perfis globais, seleção por teclado, revogação, descarte de resposta obsoleta e cancelamento. A API permanece responsável por toda autorização e isolamento em cada operação.

# Apresentação por papel empresarial (#68)

O perfil global standard/consultant não entra na avaliação de capacidades. O papel vem do membership da organização validada. A matriz segue MembershipPermission e MembershipPolicy da API:

| Operação                      | Owner | Admin            | Member | Viewer |
| ----------------------------- | ----- | ---------------- | ------ | ------ |
| financial.read                | Sim   | Sim              | Sim    | Sim    |
| financial.write               | Sim   | Sim              | Sim    | Não    |
| members.read / members.manage | Sim   | Sim, com limites | Não    | Não    |
| settings.manage               | Sim   | Sim              | Não    | Não    |
| ownership.manage              | Sim   | Não              | Não    | Não    |

Admin não pode conceder Owner nem alterar um Owner; proteção do último Owner é adicional no backend. Nenhuma ação de gerenciamento ou funcionalidade financeira é implementada por esta matriz. São contratos reutilizáveis para apresentação futura.

Papel ausente, desconhecido ou de outra organização nega apresentação por padrão. Nenhuma capacidade é persistida. A API autoriza cada operação e pode aplicar restrições adicionais; ocultar uma ação nunca substitui essa verificação.

## Reutilização e navegação (#69–74)

useAccess avalia o membership validado a cada render; AccessGate oculta o conteúdo por padrão, e ProtectedAction desabilita ações não permitidas e recusa sua execução. Use os nomes existentes de PresentationPermission; não invente permissões de produto durante a montagem de um componente.

A navegação define permission junto do item, fora da Sidebar. As duas páginas atuais são de leitura e ficam disponíveis aos quatro papéis reconhecidos; não foi criado um item administrativo fictício só para tornar os menus diferentes. Ao adicionar uma funcionalidade real, inclua sua permissão existente e testes específicos. Nenhum link para módulo financeiro ausente é exposto.

AccessState diferencia 401 (entrar novamente), 403 (operação não permitida) e 404 (recurso indisponível, sem revelar dados estrangeiros). authenticatedRequest e as barreiras tratam invalidação de identidade; um 403 não faz logout. A barreira empresarial rejeita papel desconhecido.

Permissões são derivadas do snapshot atual. A lista é apagada durante revalidação e recriada após troca de contexto, revogação ou revisão de sessão. Não existe cache de permissões em localStorage. A API pode recusar uma operação apesar da apresentação; sempre trate sua resposta.

As suítes cobrem os quatro papéis, papel desconhecido, ausência de contexto, consultores com papéis distintos, estados de transição, revogação e respostas 401/403/404.

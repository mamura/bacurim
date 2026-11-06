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

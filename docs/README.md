# Documentação técnica do frontend

Comece pelo [README](../README.md) para requisitos, instalação, ambiente, Traefik, comandos e build. O frontend corresponde ao repositório mamura/bacurim, localizado em bacurim-web no workspace.

| Tema                                            | Referência                                       |
| ----------------------------------------------- | ------------------------------------------------ |
| Contribuição, commits e Definition of Done      | [CONTRIBUTING](../CONTRIBUTING.md)               |
| Arquitetura por funcionalidades e imports       | [Arquitetura](architecture.md)                   |
| Nomes e organização de código                   | [Convenções](conventions.md)                     |
| Estado local, derivado e URL                    | [Gerenciamento de estado](state-management.md)   |
| Fronteiras Server e Client                      | [Renderização](rendering-boundaries.md)          |
| Rotas, layouts e estados de página              | [Roteamento e UI](routing-and-ui.md)             |
| Exemplo funcional de arquitetura                | [Exemplo executável](architecture-example.md)    |
| Instalação, consumo e atualização do Bacurim UI | [Design System](bacurim-ui.md)                   |
| URLs, contratos, erros, retry, timeout e mocks  | [Cliente HTTP](http-client.md)                   |
| Vitest, componentes, hooks e serviços           | [Testes e qualidade](testing.md)                 |
| GitHub Actions, build e proteções               | [Integração contínua](continuous-integration.md) |
| Registro e status das decisões                  | [Decisões técnicas](decisions.md)                |

## Identidade e experiência autenticada (WEB-M1)

- [Login, sessão e rotas protegidas](authentication.md)
- [Organizações, seleção e isolamento](organizations.md)
- [Application Shell e composição de páginas](application-shell.md)
- [Papéis e apresentação de acesso](access-presentation.md)

## ADRs

- [0001 — Arquitetura por funcionalidades](adr/0001-feature-based-architecture.md)
- [0002 — Gerenciamento de estado](adr/0002-state-management.md)
- [0003 — Fronteiras Server/Client](adr/0003-server-client-boundaries.md)
- [0004 — Roteamento e composição](adr/0004-routing-and-ui-composition.md)
- [0005 — Comunicação HTTP](adr/0005-http-communication.md)

## Referências de ambiente

.env.example é a referência de variáveis privadas de servidor e flags de prévia. Os valores locais ficam em .env.local, ignorado no Git. Variáveis NEXT_PUBLIC_* são públicas e não podem conter credenciais. Consulte a tabela no README antes de adicionar uma variável.

As prévias /dev/ui, /dev/architecture e /dev/http servem para validação técnica em desenvolvimento e retornam 404 por padrão em produção. Não representam funcionalidades financeiras ou autenticação implementadas.

Atualize a documentação na mesma issue que alterar um contrato, comando ou decisão. Preserve a distinção entre comportamento implementado e capacidades futuras.

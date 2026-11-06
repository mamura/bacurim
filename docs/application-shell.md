# Application Shell (#61–67)

O layout de /app/organizations/:organizationId compõe AuthBoundary (no layout pai), OrganizationProvider, OrganizationBoundary e ApplicationShell. Identidade e contexto são resolvidos antes da apresentação do ambiente empresarial. O Shell não autentica nem consulta diretamente os serviços.

ApplicationFrame reutiliza AppShell do Bacurim UI para header, Sidebar e um main único. PageContent organiza título h1, descrição, ações e children. Loading e erro recuperável usam os componentes compartilhados; a página inicial é estrutural e não simula um dashboard financeiro.

ApplicationNavigation usa a configuração separada navigation.ts, identifica a rota ativa e integra os anchors do Sidebar ao router Next, preservando cliques modificados. Apenas Início e Meu acesso são rotas operacionais. Itens financeiros/admin não implementados não são exibidos. Os ícones usam Lucide, a mesma família da biblioteca.

ApplicationHeader mostra usuário e empresa, logout pelo mecanismo da sessão e acesso à troca somente para consultores com múltiplos vínculos. Nomes longos são truncados visualmente com nome completo disponível. A escolha de empresa retorna ao fluxo existente, com revalidação antes de navegar.

Em desktop, a Sidebar pode ser recolhida; em viewport abaixo de 64rem, o Menu abre o painel móvel existente do Bacurim UI. O componente da biblioteca mantém foco modal, Escape, inert no conteúdo e restauração de foco. A seleção de rota fecha o painel; popstate também o fecha. A configuração de navegação é a mesma nos dois modos.

As rotas e providers não devem conter novos dados financeiros em Server Components sem verificação de sessão no servidor. Features futuras usam PageContent e o escopo de requisições empresariais documentado em organizations.md.

Testes verificam composição, rota ativa, recolhimento, navegação Next, identidade, logout, abertura móvel, Escape e devolução do foco. A validação real em desktop/mobile faz parte da tarefa integrada #75.

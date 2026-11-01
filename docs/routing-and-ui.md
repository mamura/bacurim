# Rotas, layouts e composição (#18)

## Rotas

app concentra URLs, metadados, layouts e composição das entradas públicas
das features. Não recebe serviços HTTP genéricos nem componentes de domínio
como implementações internas. Mantenha uma página curta sempre que houver
lógica suficiente para pertencer à funcionalidade.

O grupo (development) organiza /dev/ui e exemplos técnicos futuros; os
parênteses não fazem parte da URL. As páginas técnicas verificam suas flags
no servidor e retornam 404 quando desabilitadas em produção.

Não criar agora grupos (auth) ou (application) nem um App Shell autenticado.
Essas responsabilidades são de WEB-M1. Quando houver necessidade, grupos
poderão selecionar layouts distintos sem alterar as URLs. Layout raiz
continua responsável por html, body, CSS global e metadados comuns.

## Composição

A rota seleciona dados e compõe a feature. Uma feature organiza seus
componentes e estado. shared/ui contém composições neutras realmente
reutilizáveis; bacurim-ui fornece os primitivos, estilos e tokens.
Não criar um wrapper por componente apenas para alterar o caminho do import.

Links de navegação da aplicação usam next/link quando compatível com a
API do componente. A Sidebar atual da biblioteca ainda recebe href ou
callback; adaptações ficam na composição da funcionalidade. A prévia técnica
aprovada preserva o comportamento da biblioteca.

## Loading, error e empty

- loading.tsx usa PageLoading para comunicar atividade com role=status,
  aria-busy e Skeleton da biblioteca. Para streaming localizado, prefira
  Suspense perto da leitura de dados quando houver essa necessidade.
- error.tsx é cliente e usa PageErrorState. Mostra uma mensagem segura,
  um caminho de recuperação e reset para tentar renderizar novamente.
  Não mostra a exceção bruta nem confunde erro com ausência de dados.
- Resultado vazio bem-sucedido usa PageEmptyState. Diferencie uma lista
  sem itens de um filtro sem correspondência e ofereça uma ação útil.
- Falha de mutação mantém o formulário/rascunho e associa erros conhecidos
  aos campos. Não substitua a página inteira por um empty state.
- Retry é adequado a renderização/leitura idempotente. Nunca reenvie uma
  operação financeira automaticamente sem política explícita.

Essas composições não gerenciam sessão ou acesso a dados. O grupo técnico
possui loading.tsx e error.tsx; o exemplo arquitetural usa empty states.

## Formulários e listas

Formulários usam labels associados, FormField e os controles públicos da
biblioteca. Campos obrigatórios, loading, disabled e mensagens de erro
devem ser perceptíveis por texto e tecnologias assistivas.
Validações de experiência não substituem as regras ou a validação da API.
Não redefina contratos HTTP nesta camada.

Listagens reais mantêm filtro, ordenação e paginação navegáveis na URL
quando útil. O serviço valida e adapta os parâmetros; componentes recebem
modelos de apresentação. Use Table e FormattedValue em vez de reproduzir
formatação ou uma tabela visual própria.

## Responsividade e acessibilidade

Use tokens e utilitários responsivos existentes. Evite largura fixa no
conteúdo; tabelas podem ter scroll local sem provocar scroll horizontal
na página. Teste ao menos desktop e uma largura móvel.

Mantenha um h1 e hierarquia coerente, landmarks, nome acessível de controles,
foco visível, navegação por teclado e recuperação de foco após overlays.
Feedback não depende só de cores. Use role=status para resultados não
urgentes e role=alert para erros que exigem atenção.

O AppShell da biblioteca já oferece painel móvel, Escape e controle de foco.
Não reimplemente esse comportamento dentro de uma feature.

Veja [ADR 0004](adr/0004-routing-and-ui-composition.md).

## Bloqueio antes do streaming

src/proxy.ts verifica apenas as flags das duas prévias técnicas e devolve
404 com no-store antes de iniciar o streaming. As páginas mantêm sua
verificação no servidor. Isso evita uma resposta 200 de um shell de
loading para uma prévia desabilitada. O proxy não implementa autenticação
nem autorização e não intercepta as demais rotas da aplicação.

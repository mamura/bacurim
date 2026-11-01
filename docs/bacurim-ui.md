# Consumo do Bacurim UI

## Estratégia inicial (#8)

A aplicação instala um tarball npm versionado, mantido em
`vendor/bacurim-ui-0.1.0.tgz`. Essa distribuição permite `npm ci` em um
checkout novo e no Docker sem registro privado ou acesso ao repositório
vizinho. O frontend consome o pacote, não copia componentes nem importa
arquivos internos da biblioteca.

O artefato é produzido pelo repositório independente `mamura/bacurim-ui`
com `npm run build:package` e `npm pack`. A origem inicial é o commit
`30aa875`, versão `0.1.0`. O lockfile npm registra a integridade do arquivo.

## Contrato público

- `import { Button } from "bacurim-ui"`: JavaScript ESM e tipos.
- `import type { ButtonProps } from "bacurim-ui"`: tipos públicos.
- `@import "bacurim-ui/styles.css"`: tokens originais, fontes e animações.
- O pacote declara React e React DOM 19 como peers; a aplicação fornece
  uma única instalação de cada um.
- Tailwind 4.3.3 processa os tokens e as classes do pacote no frontend.
- Os componentes são exportados como Client Components pelo entrypoint
  marcado com `"use client"`. Podem ser compostos por uma página de servidor;
  callbacks e estado ficam em um componente cliente da aplicação.
- O CSS público não inclui Tailwind nem Preflight. A aplicação mantém um
  único `@import "tailwindcss"`.

O tarball inclui JavaScript compilado, declarações e CSS. Não inclui
histórias, testes ou o código TypeScript dos componentes. Radix, ícones
e fontes são dependências declaradas; React não é incorporado ao bundle.

## Versionamento e atualização

Não substitua um tarball já distribuído por outro de mesmo nome/versão.
Incremente a versão na biblioteca e gere um novo pacote. Antes de 1.0,
mudanças incompatíveis incrementam minor; correções compatíveis, patch.

1. Valide e publique o commit da biblioteca em master.
2. Execute `npm pack --pack-destination /tmp` no repositório da biblioteca.
3. Copie o novo arquivo para `vendor/` neste repositório.
4. Instale com `npm install --save-exact ./vendor/bacurim-ui-VERSAO.tgz`.
5. Confira `npm ls react react-dom bacurim-ui`, tipos, build e a rota de
   validação quando habilitada.
6. Commit e push do tarball, package.json e package-lock.json juntos.
7. Reinicie o container para atualizar seu volume de dependências.

O ambiente normal exige apenas este repositório. A pasta da biblioteca é
necessária somente para quem gera uma nova versão. Publicar no npm ou
em um registro privado é uma evolução possível, sem mudar os imports.

## Limitações identificadas

O build original da biblioteca gerava apenas a demonstração Vite.
O empacotamento foi acrescentado em `bacurim-ui#70`, com correções de
tipagem em `bacurim-ui#71`. O pacote e o Storybook fazem build.
O comando original `npm run build` da biblioteca ainda encontra erros
preexistentes de tipagem em histórias (FormField, FilterBar e ordenação de
tabela); essas histórias não são incluídas no pacote instalado.

## Convenções de utilização (#12)

Importe componentes e tipos somente de `bacurim-ui`. Não faça imports de
`src/`, `dist-package/` ou caminhos relativos para o repositório vizinho.
O `@source` do Tailwind aponta para o pacote instalado para detectar suas
classes; isso não representa um import de implementação.

```tsx
"use client";

import { Button, Input, type ButtonProps } from "bacurim-ui";
```

Use componentes cliente para estado, callbacks e composição interativa.
Páginas de servidor podem renderizar componentes públicos com props
serializáveis. Nunca passe funções comuns de um Server Component ao cliente.
A configuração privada da aplicação permanece em módulos server-only.

A aplicação é responsável por compor páginas e fluxos de negócio.
Componentes próprios podem expressar uma necessidade específica da aplicação
que ainda não exista na biblioteca; não copie nem recrie Button, Input,
Sidebar ou seus estilos. Antes de criar uma alternativa visual reutilizável,
abra uma issue no repositório da biblioteca. Correções e novas variantes
devem ser incorporadas por uma nova versão do pacote.

O CSS global importa Tailwind uma vez e o CSS público da biblioteca uma vez.
Os tokens originais geram as classes semânticas (bg-primary, text-text-primary,
font-heading, font-body, heading-md, etc.). Não redeclare valores de cores,
fontes, radius ou sombras no frontend. Fontsource fornece Inter 400/500 e
Poppins 600/700 localmente, sem depender de Google Fonts.

## Rota temporária e validação manual

Acesse [a prévia local](http://bacurim.mamura.test/dev/ui) com o servidor de
desenvolvimento. Ela compõe componentes reais do pacote, sem chamadas à API.

- Recolha e expanda a Sidebar; selecione seções e confira o item ativo.
- Em tela menor que 1024 px, use Abrir navegação. A seleção fecha o painel;
  Escape também deve fechá-lo e devolver o foco ao botão de abertura.
- Use Testar ação e confira a notificação.
- Abra o diálogo, confira foco e fechamento com Escape.
- Digite no formulário, altere o Select e ative o checkbox de erro.
- Valide o formulário: o botão mostra carregamento e uma confirmação local.
- Confira botões e campo desabilitados, Badge, Progress, Skeleton e Table.
- Confira Poppins nos títulos e Inter no corpo, incluindo em tela pequena.

A rota exporta noindex/nofollow e usa verificação no servidor por requisição.
Em produção ela retorna 404, a menos que `ENABLE_UI_PREVIEW=true` seja
explicitamente definido no processo do servidor. Essa flag é privada e
não deve ser habilitada em uma disponibilização normal aos usuários.
Não há link da página inicial para essa rota.

Para validar o build de produção localmente:

```bash
npm run build
ENABLE_UI_PREVIEW=true npm start
```

Sem a flag, `npm start` deve servir a página inicial e retornar 404 na
prévia. Isso permite manter o exemplo isolado durante o desenvolvimento.

## Evidências desta integração

- Build do pacote e build Storybook concluídos.
- Frontend: npm run typecheck e npm run build concluídos.
- npm ls confirmou React e React DOM 19.3.1 compartilhados pelos pacotes.
- CSS de produção contém os tokens, utilitários e fontes WOFF2 locais;
  apenas uma camada base de Preflight.
- Navegador: estados de Sidebar, formulário, Select, diálogo, notificações
  e fontes conferidos em produção; sem erros ou avisos no console.
- Desktop e viewport móvel de 390 px sem transbordamento horizontal.
- Traefik: HTTP 200 para a prévia de desenvolvimento.
- Produção: 404 por padrão e 200 com habilitação explícita da prévia.

O erro do build da demonstração da biblioteca está registrado separadamente
em [bacurim-ui#72](https://github.com/mamura/bacurim-ui/issues/72).
As issues desta integração ficam abertas até a validação do usuário.

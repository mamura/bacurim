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

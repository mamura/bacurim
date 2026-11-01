# Decisões técnicas da inicialização

## Framework e runtime

Next.js 16 com App Router e React 19. O código usa TypeScript 5.9 em modo
estrito desde o primeiro commit. Node 24 LTS está registrado em .nvmrc
e no campo engines; as versões exatas dos pacotes estão no package-lock.json.

A escolha atende à issue #1 e mantém compatibilidade com o React utilizado
no Bacurim UI. Use npm ci para reproduzir a instalação.

## Estrutura e renderização

A aplicação usa src/app para rotas, layout raiz e estilos globais.
A página inicial é um Server Component pré-renderizado, sem cliente HTTP
ou dependência da API. A configuração compartilhada pelo layout e pela
página fica em src/shared/config/app.ts, protegida por server-only.

APP_URL aceita URLs HTTP(S), com padrão para o domínio local.
O layout define título, descrição, nome da aplicação e idioma pt-BR.
A configuração usa o alias @/*, resolvido para src/* pelo TypeScript.

A organização por funcionalidades e o estado estão detalhados nas ADRs
0001 a 0004 e em architecture.md. A comunicação com a API pertence à issue #20.

## CSS

Tailwind 4.3.3 com PostCSS, conforme a versão usada pela biblioteca de UI.
O CSS entra somente pelo layout raiz. Não há configuração JavaScript de
tema nem tokens locais que dupliquem o Bacurim UI. Preflight é o reset atual.
A integração do CSS público da biblioteca mantém apenas um reset.

## Ambiente de desenvolvimento

O Compose do frontend usa a rede externa dev-network e o Traefik existente.
O roteador serve bacurim.mamura.test pelo entrypoint HTTP web.
Volumes separados mantêm as dependências e o cache do container independentes
do host. O Compose não depende da API e não representa deploy de produção.

## Referências

- [Instalação do Next.js](https://nextjs.org/docs/app/getting-started/installation)
- [Metadados](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Variáveis de ambiente](https://nextjs.org/docs/app/guides/environment-variables)
- [Tailwind com PostCSS](https://tailwindcss.com/docs/installation/using-postcss)

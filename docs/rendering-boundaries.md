# Fronteiras de execução (#17)

## Servidor por padrão

Layouts e páginas são Server Components. Eles leem contexto autorizado,
carregam dados por entradas server das features, definem metadados e
compõem a página. Um layout não deve repetir consultas ou conter lógica
de domínio apenas para compartilhar dados.

Serviços com segredos, sessão ou contexto do tenant importam server-only.
Isso inclui configuração privada e leitura de flags técnicas. Nunca
reexporte esses módulos pela entrada que expõe componentes cliente.
A proteção do Next.js também percorre imports transitivos.

O projeto mantém os parâmetros da aplicação em @shared/config/app e o
controle de prévias em @shared/lib/development-preview. São módulos
exclusivos do servidor, não configurações públicas do navegador.

## Cliente quando necessário

Use "use client" no menor componente que precisa de estado, eventos,
effects ou APIs do navegador. Não transforme o layout raiz em componente
cliente para acomodar uma interação isolada.

O pacote bacurim-ui tem uma entrada marcada como cliente. Uma página de
servidor pode renderizar seus componentes passando props serializáveis.
Funções de evento pertencem a um componente cliente da aplicação.
Não crie wrappers de cada primitivo apenas para repetir a diretiva.

Exemplo atual: app/(development)/dev/ui carrega @features/ui-preview; a feature mantém
eventos e estado. A feature não conhece a rota nem lê process.env.

## Dados seguros e limites de props

A página chama um serviço server-only, que retorna somente o modelo
necessário à apresentação. Envie ao cliente valores serializáveis e
mínimos. Não passe objetos de request, headers, cookies, tokens, erros
internos, instâncias de cliente HTTP ou credenciais por props.

Valide entrada externa (incluindo searchParams) antes de consumi-la.
A API continua responsável por autenticação, autorização e tenant.
Esconder um botão, guardar um tenantId no Context ou bloquear uma rota
técnica não substitui autorização.

O navegador não acessa módulos de servidor diretamente. Quando uma
operação realmente exigir comunicação cliente, a camada da issue #20
definirá o serviço e os contratos. Evite fetch dentro de componentes
de apresentação. Server Actions só serão usadas com uma necessidade
definida; "use server" não é uma diretiva para marcar Server Components.

## Apresentação e erros

Use modelos de apresentação e mensagens seguras. O error.tsx não
renderiza error.message de uma resposta ou exceção arbitrária.
O detalhe técnico fica no tratamento/log apropriado do servidor, sem
imprimir credenciais. Não serialize erros internos para a UI.

Leia também [a estratégia de estado](state-management.md) e
[a integração da biblioteca](bacurim-ui.md).

Referência: [Server e Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).

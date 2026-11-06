# Autenticação WEB-M1

## Login (#42–47)

A rota pública /login usa o layout de autenticação e componentes reais do Bacurim UI. O formulário valida e-mail obrigatório/válido (até 254) e senha obrigatória (até 128), sem impor mínimo a credenciais legadas e sem remover espaços da senha. Labels, autocomplete username/current-password, mensagens associadas, foco no primeiro campo inválido e envio pelo teclado compõem o contrato acessível.

O navegador chama GET /sanctum/csrf-cookie (204), depois POST /api/v1/auth/login com email/password. Usa credentials:include e X-XSRF-TOKEN decodificado do cookie atual. O backend regenera sessão e CSRF após login; futuras mutações devem reler o cookie. Não há retries automáticos para login. Falhas 401, 422, 429, 419, origem 403 e rede possuem mensagens locais seguras; uma nova submissão reinicia CSRF. Não há armazenamento local, tokens próprios ou logs de credenciais; o campo de senha é limpo após cada tentativa.

A resposta preserva data.public_id, name, email, status, email_verified_at e profile (standard/consultant). O serviço valida o envelope em runtime. Perfis não alteram o login nem escolhem empresas.

O destino padrão é /app. Apenas destinos internos sob /app são preservados; origens externas, barras codificadas, controles e escape de caminho são recusados.

## Ambiente browser

NEXT_PUBLIC_API_ORIGIN é uma origem pública sem /api/v1, por exemplo http://api-bacurim.mamura.test. Ela é incorporada ao bundle no build; configure explicitamente a origem HTTPS em produção. Não contém secrets. O API_BASE_URL privado continua exclusivo dos serviços de servidor da WEB-M0.

API e frontend devem compartilhar um domínio de cookies confiável. No local, SESSION_DOMAIN=.mamura.test e CORS/Sanctum autorizam http://bacurim.mamura.test. Em produção, use HTTPS e o menor domínio comum controlado. O cookie de sessão permanece HttpOnly; apenas XSRF-TOKEN é lido. Não encaminhamos cookies pelo servidor Next.js neste fluxo.

O transporte browser omite X-Request-ID de saída porque esse header não integra a allowlist CORS atual da API. A correlação local e o restante do cliente permanecem preservados. Não é necessário ampliar permissões CORS para autenticar.

Referências de contrato: bacurim-api/docs/authentication.md e user-profiles.md. [Sanctum SPA](https://laravel.com/docs/12.x/sanctum#spa-authentication).

## Sessão e rotas privadas (#48–53)

SessionProvider compartilha somente a identidade pública em memória. SessionStore possui loading, authenticated, unauthenticated e error: rede e 403 não são logout. Consultas simultâneas são coalescidas; revisões impedem que uma resposta antiga restaure identidade após login/logout mais recente.

AuthBoundary protege o grupo /app e oculta children durante loading, erro e redirecionamento. O servidor Next não consulta a API sem credenciais: a barreira é client-side. As páginas desta milestone contêm somente estrutura; futuros dados privados devem usar authenticatedRequest após a validação, nunca ser serializados por um Server Component sem verificação equivalente no servidor.

GET auth/me restaura a identidade ao entrar e no retorno de foco/visibilidade. Após login, a identidade retornada é adotada. Logout usa bootstrap CSRF e POST auth/logout; somente sucesso ou 401 confirmado encerram o acesso. Se a rede falhar, mostra recuperação e exige revalidação, sem afirmar que a sessão do servidor foi encerrada. Nenhum cookie HttpOnly é manipulado.

authenticatedRequest centraliza 401 dos endpoints protegidos e notifica o provider. 403 permanece autorização, 404 recurso indisponível. Uma época de autenticação impede que 401 de uma sessão anterior encerre uma nova. A identidade e o contexto privado deixam de ser renderizados durante revalidação; não há autorização baseada em localStorage.

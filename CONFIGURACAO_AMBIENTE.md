# Configuração completa do ambiente — CatalogoJá

Este guia mostra onde obter cada valor, onde colocá-lo localmente e onde cadastrá-lo na Vercel, no Supabase e no Asaas.

## 1. Arquivos corretos

- Valores reais e segredos locais: `C:\Projeto-Github\CatalogoJá\.env.local`
- Modelo sem segredos: `C:\Projeto-Github\CatalogoJá\.env.example`
- Configuração do banco: `C:\Projeto-Github\CatalogoJá\supabase\schema.sql`
- Migration adicional do Asaas: `C:\Projeto-Github\CatalogoJá\supabase\migrations\202608060004_asaas_customer_lookup.sql`

Nunca coloque API keys, Secret keys ou tokens reais em `.env.example`. O `.env.local` está ignorado pelo Git e é o lugar correto para o desenvolvimento local.

## 2. Formato completo do `.env.local`

O arquivo local já possui todas estas variáveis. Preencha somente os campos que estiverem vazios:

```dotenv
# Supabase público
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# Localmente use localhost. Na Vercel use o domínio público HTTPS.
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Opcional: acesso público ao painel de demonstração.
DEMO_ACCESS_ENABLED=true

# Envio de link por e-mail desativado nesta fase.
EMAIL_AUTH_ENABLED=false

# Supabase Admin — segredo somente do servidor
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Asaas — segredos somente do servidor
ASAAS_API_KEY=$aact_hmlg_...
ASAAS_API_URL=
ASAAS_WEBHOOK_TOKEN=SEU_TOKEN_ALEATORIO

```

## 3. Onde obter cada variável

| Variável | Onde obter | Onde colocar | Obrigatória agora |
|---|---|---|---:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → projeto → **Connect** ou **Settings → API Keys** → Project URL | `.env.local` e Vercel | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → **Settings → API Keys** → Publishable key (`sb_publishable_...`) | `.env.local` e Vercel | Sim |
| `NEXT_PUBLIC_SITE_URL` | Local: `http://localhost:3000`. Produção: domínio em Vercel → projeto → **Settings → Domains** | `.env.local` e Vercel | Sim |
| `DEMO_ACCESS_ENABLED` | Valor definido por você: `true` ou `false` | `.env.local` e Vercel | Não |
| `EMAIL_AUTH_ENABLED` | Valor definido por você; mantenha `false` nesta fase | `.env.local` e Vercel | Não |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → **Settings → API Keys** → Secret key (`sb_secret_...`); a `service_role` legada também funciona | `.env.local` e Vercel | Sim para cadastro pago |
| `ASAAS_API_KEY` | Painel web do Asaas → **Integrações → Chave da API** | `.env.local` e Vercel | Sim |
| `ASAAS_API_URL` | Não precisa obter com chaves atuais | Deixe vazia | Não |
| `ASAAS_WEBHOOK_TOKEN` | Segredo aleatório criado por você | `.env.local`, Vercel e webhook do Asaas | Sim |

Documentação oficial das chaves do Supabase: https://supabase.com/docs/guides/getting-started/api-keys

### Atenção aos nomes

Mesmo usando a Publishable key nova do Supabase, o nome esperado pelo código continua sendo:

```dotenv
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

Não crie `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, pois o código atual não lê esse nome.

## 4. Obter a Secret key do Supabase

1. Entre em https://supabase.com/dashboard.
2. Abra o projeto do CatalogoJá.
3. Acesse **Settings → API Keys**.
4. Na área de Secret keys, crie ou copie uma chave iniciada por `sb_secret_`.
5. Cole somente em `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`.
6. Depois adicione a mesma variável na Vercel.

Essa chave ignora RLS e nunca pode aparecer no navegador, no Git, em screenshots ou em mensagens.

## 5. Gerar o token do webhook

No PowerShell do Windows, execute:

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$token = ([System.BitConverter]::ToString($bytes)).Replace('-', '').ToLower()
Set-Clipboard -Value $token
Write-Host "Token copiado para a área de transferência."
```

Cole o resultado em três lugares, sempre exatamente igual:

1. `.env.local`:

   ```dotenv
   ASAAS_WEBHOOK_TOKEN=COLE_O_TOKEN
   ```

2. Vercel → `ASAAS_WEBHOOK_TOKEN`.
3. Asaas → configuração do webhook → **Token de autenticação**.

O token deve ter entre 32 e 255 caracteres e deve ser diferente da API key do Asaas.

## 6. API key do Asaas

### Sandbox

1. Entre em https://sandbox.asaas.com.
2. Use um usuário administrador.
3. Abra o menu do usuário → **Integrações → Chave da API**.
4. Clique em **Gerar nova chave da API**.
5. Copie a chave no momento da criação.
6. Salve em `ASAAS_API_KEY` no `.env.local` e na Vercel.

A chave atual de Sandbox começa com `$aact_hmlg_`.

### Produção

Repita o processo na conta real do Asaas. A chave atual de Produção começa com `$aact_prod_`.

O código identifica o ambiente pelo prefixo da chave:

- `$aact_hmlg_...` → Sandbox;
- `$aact_prod_...` → Produção.

Por isso `ASAAS_API_URL` pode permanecer vazia. Ao migrar para Produção, troque a API key e cadastre novamente o webhook na conta real; não é necessária alteração no código.

Documentação oficial: https://docs.asaas.com/docs/authentication

## 7. Colocar as variáveis na Vercel

1. Importe o repositório no https://vercel.com.
2. Abra o projeto → **Settings → Environment Variables**.
3. Cadastre as variáveis abaixo em **Production**. Use também **Preview** se testar deploys de branches:

   ```text
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_SITE_URL
   DEMO_ACCESS_ENABLED
   EMAIL_AUTH_ENABLED
   SUPABASE_SERVICE_ROLE_KEY
   ASAAS_API_KEY
   ASAAS_WEBHOOK_TOKEN
   ```

4. `ASAAS_API_URL` pode ficar ausente nesta fase. Não configure Resend: o projeto não envia e-mails atualmente.
5. Faça o primeiro deploy.
6. Abra **Settings → Domains** e copie o domínio `https://...vercel.app`.
7. Atualize `NEXT_PUBLIC_SITE_URL` na Vercel com esse domínio, sem barra no final.
8. Faça **Redeploy**. Variáveis alteradas não são aplicadas aos deployments antigos.

Documentação oficial: https://vercel.com/docs/environment-variables/managing-environment-variables

## 8. Autenticação nesta fase

O projeto não envia convite, magic link nem mensagem de boas-vindas. Mantenha `EMAIL_AUTH_ENABLED=false` na Vercel.

- Para desenvolvimento local, crie manualmente um usuário com e-mail e senha em **Supabase → Authentication → Users → Add user → Create new user**.
- Para visitantes em produção, mantenha `DEMO_ACCESS_ENABLED=true` enquanto a autenticação definitiva não for escolhida.
- O webhook de pagamento cria o usuário confirmado e a loja sem enviar e-mail, mas esse novo cliente não terá acesso ao painel até recebermos uma forma de autenticação.

As URLs de callback em **Authentication → URL Configuration** só precisarão ser configuradas quando o login por link for ativado no futuro.

## 9. Cadastrar o webhook no Asaas

Faça isto somente depois que a URL pública da Vercel estiver funcionando.

1. No Asaas Sandbox, abra **Integrações → Webhooks**.
2. Crie um webhook chamado `CatalogoJa Sandbox`.
3. Use:

   ```text
   URL: https://SEU-PROJETO.vercel.app/api/webhooks/asaas
   Token de autenticação: mesmo valor de ASAAS_WEBHOOK_TOKEN
   API: v3
   Envio: sequencial
   Ativo: sim
   ```

4. Informe um e-mail que você monitora para alertas de falha.
5. Marque somente estes eventos:

   ```text
   CHECKOUT_PAID
   CHECKOUT_CANCELED
   CHECKOUT_EXPIRED
   PAYMENT_CONFIRMED
   PAYMENT_RECEIVED
   PAYMENT_OVERDUE
   SUBSCRIPTION_DELETED
   SUBSCRIPTION_INACTIVATED
   ```

6. Salve e confira **Integrações → Logs de Webhooks** depois do teste. O retorno correto da aplicação é HTTP `200`.

Documentação oficial: https://docs.asaas.com/docs/about-webhooks

## 10. Testar o fluxo completo

1. Abra `https://SEU-PROJETO.vercel.app/cadastro`.
2. Preencha a loja com um slug ainda não utilizado.
3. Avance até o Checkout Asaas.
4. No Sandbox, use:

   ```text
   Cartão aprovado: 4444 4444 4444 4444
   Validade: qualquer data futura
   CVV: 123
   ```

5. Após a aprovação, aguarde `/cadastro/sucesso` mostrar “Sua loja está no ar!”.
6. Confirme no Supabase:
   - usuário confirmado em **Authentication → Users**, criado sem envio de e-mail;
   - intenção com status `pago` em `signup_intents`;
   - tenant com status `ativo` em `tenants`;
   - assinatura com status `ativo` e IDs `cus_...`/`sub_...` em `subscriptions`.
7. Confirme no Asaas que o webhook recebeu HTTP `200`.

Cartões de recusa do Sandbox:

```text
Mastercard: 5184 0197 4037 3151
Visa:       4916 5613 5824 0741
```

Documentação oficial dos cartões: https://docs.asaas.com/docs/testing-credit-card-payment

## 11. O que já está pronto e o que falta

Já configurado localmente:

- URL pública do Supabase;
- Publishable key do Supabase;
- API key do Asaas Sandbox;
- envio de e-mail desativado com `EMAIL_AUTH_ENABLED=false`;
- todas as variáveis declaradas no `.env.local`.

Ainda é necessário preencher:

- `SUPABASE_SERVICE_ROLE_KEY`;
- `ASAAS_WEBHOOK_TOKEN`;
- `NEXT_PUBLIC_SITE_URL` com HTTPS depois do deploy;
- as mesmas variáveis na Vercel;
- webhook no painel do Asaas.

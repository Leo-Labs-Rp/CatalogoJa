# Setup de teste — Supabase, Vercel e Asaas Sandbox

Este guia prepara um ambiente inicial para testar autenticação, painel, CRUD, imagens, loja pública e, opcionalmente, pagamentos no Asaas Sandbox.

## Resumo da ordem recomendada

1. Crie um projeto vazio no Supabase.
2. Execute **uma única vez** o arquivo consolidado `supabase/schema.sql` no SQL Editor.
3. Crie manualmente um usuário de teste com e-mail e senha no Supabase Auth.
4. Crie o tenant de teste com o SQL deste guia.
5. Importe o repositório na Vercel e configure as três variáveis mínimas.
6. Entre em `/painel` com a conta manual no ambiente local ou use a demonstração pública.
7. Teste o painel e a loja pública.
8. Para testar pagamentos, configure a service role do Supabase, o Asaas Sandbox e o webhook público seguindo a seção 7.

## 1. Banco de dados

### Opção recomendada para um projeto novo

Execute o arquivo consolidado:

- Caminho relativo: `supabase/schema.sql`
- Caminho real neste workspace: `C:\Projeto-Github\CatalogoJá\supabase\schema.sql`

No Supabase, abra **SQL Editor → New query**, copie todo o conteúdo do arquivo e clique em **Run**. O arquivo foi preparado para um projeto vazio e cria:

- `public.tenants`;
- `public.categories`;
- `public.products`;
- `public.subscriptions`;
- `public.signup_intents`;
- `public.asaas_webhook_events`;
- constraints, chaves estrangeiras e índices;
- triggers de `updated_at`;
- RLS e policies por proprietário;
- RPCs seguras `get_public_catalog` e `get_public_store_status`;
- bucket `produtos` e suas policies de Storage.

> Execute o consolidado apenas uma vez. Ele não deve ser combinado com as migrations abaixo no mesmo banco.

### Alternativa: migrations individuais

Se preferir manter o histórico de migrations, execute estes arquivos na ordem:

1. `C:\Projeto-Github\CatalogoJá\supabase\migrations\202607180001_initial_schema.sql`
2. `C:\Projeto-Github\CatalogoJá\supabase\migrations\202607190002_functional_screens.sql`
3. `C:\Projeto-Github\CatalogoJá\supabase\migrations\202607190003_normalize_brazil_whatsapp.sql`
4. `C:\Projeto-Github\CatalogoJá\supabase\migrations\202608060004_asaas_customer_lookup.sql`

Os mesmos caminhos, relativos à raiz do projeto, são:

1. `supabase/migrations/202607180001_initial_schema.sql`
2. `supabase/migrations/202607190002_functional_screens.sql`
3. `supabase/migrations/202607190003_normalize_brazil_whatsapp.sql`
4. `supabase/migrations/202608060004_asaas_customer_lookup.sql`

Não execute `supabase/schema.sql` se essas migrations já tiverem sido aplicadas.

## 2. Storage

O nome exato do bucket é:

```text
produtos
```

Apesar do nome, o mesmo bucket armazena imagens de produtos, logos e banners.

- O bucket é criado automaticamente por `supabase/schema.sql` ou pela primeira migration. Não é necessário criá-lo manualmente no painel.
- O bucket é público para leitura das imagens da loja.
- Limite por arquivo: 2 MB.
- Formatos permitidos: JPEG, PNG e WebP.
- O caminho de cada objeto começa pelo UUID do tenant: `{tenant_id}/arquivo.webp`.
- `SELECT`: permitido para `anon` e `authenticated` no bucket `produtos`.
- `INSERT`, `UPDATE` e `DELETE`: permitidos somente ao usuário autenticado que seja proprietário do tenant indicado na primeira pasta.

As policies ficam no próprio SQL consolidado. O Supabase Storage usa RLS sobre `storage.objects`; sem policies de escrita, uploads são bloqueados por padrão. Consulte a [documentação oficial de acesso do Storage](https://supabase.com/docs/guides/storage/security/access-control).

Os usos reais do bucket no código estão em:

- `C:\Projeto-Github\CatalogoJá\src\app\painel\(app)\loja\actions.ts`
- `C:\Projeto-Github\CatalogoJá\src\app\painel\(app)\produtos\actions.ts`
- `C:\Projeto-Github\CatalogoJá\src\app\painel\(app)\categorias\actions.ts`

## 3. Autenticação para o teste manual

O projeto não envia e-mails nesta fase. O login por magic link está desligado por padrão com `EMAIL_AUTH_ENABLED=false`, e o webhook cria o usuário do comprador já confirmado, sem convite e sem mensagem de boas-vindas.

Para testar o painel agora:

1. Abra **Supabase → Authentication → Users**.
2. Clique em **Add user → Create new user**.
3. Informe um e-mail e uma senha temporária e marque o usuário como confirmado.
4. Associe o UUID desse usuário a `tenants.owner_user_id` usando o seed da seção 6.
5. No ambiente local, entre em `/painel` com esse e-mail e senha. O login por senha local não é exibido em produção.

Em produção, mantenha o botão de demonstração habilitado com `DEMO_ACCESS_ENABLED=true` enquanto a tecnologia de autenticação definitiva não for escolhida. Novos pagamentos criam a loja e o usuário silenciosamente, mas o cliente ainda não recebe uma credencial para acessar o painel.

## 4. Variáveis de ambiente

O arquivo de referência está atualizado com todas as variáveis lidas pelo código atual:

- Caminho relativo: `.env.example`
- Caminho real: `C:\Projeto-Github\CatalogoJá\.env.example`

Para uso local, copie-o para `.env.local` e substitua os valores. Não versione `.env.local`.

| Variável | Onde obter | Modo básico sem Asaas | Uso |
|---|---|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → **Connect** ou **Settings → API Keys/API Settings** → Project URL | Obrigatória | URL do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → **Connect** ou **Settings → API Keys** → Publishable key; a `anon` legada também funciona | Obrigatória | Cliente público protegido por RLS. |
| `NEXT_PUBLIC_SITE_URL` | Domínio do projeto na Vercel | Obrigatória no deploy | Origem canônica dos callbacks e links. Use `https://SEU-PROJETO.vercel.app`. |
| `DEMO_ACCESS_ENABLED` | Definida manualmente; padrão `true` | Não | Controla o botão e o painel público de demonstração somente leitura. Use `false` para ocultá-los. |
| `EMAIL_AUTH_ENABLED` | Definida manualmente; use `false` nesta fase | Não | Mantém o envio de magic link desligado até a escolha do provedor de autenticação/e-mail. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → **Settings → API Keys** → Secret key; a `service_role` legada também funciona | Opcional no teste manual; recomendada | Rotas administrativas, disponibilidade de slug, checkout e webhook. Nunca expor no navegador. |
| `ASAAS_API_KEY` | Painel web do ambiente Asaas → **Integrações → Chave da API** | Não | Cria o checkout recorrente. O prefixo atual seleciona Sandbox ou Produção automaticamente. |
| `ASAAS_WEBHOOK_TOKEN` | Segredo gerado por você e copiado para o webhook no Asaas | Não | Valida o header de `POST /api/webhooks/asaas`; deve ter 32–255 caracteres e ser diferente da API key. |
| `ASAAS_API_URL` | Somente para uma chave Asaas legada sem prefixo de ambiente | Não | Override opcional. Deixe vazio com chaves atuais `$aact_hmlg_...` ou `$aact_prod_...`. |

O Supabase atualmente recomenda Publishable/Secret keys para novos projetos, mas mantém compatibilidade com as chaves legadas `anon`/`service_role`. Veja [Understanding API keys](https://supabase.com/docs/guides/getting-started/api-keys).

### Valores mínimos na Vercel

Para o painel manual, RLS, Storage e loja pública funcionarem, configure antes do deploy:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=https://SEU-PROJETO.vercel.app
```

Também é recomendado configurar `SUPABASE_SERVICE_ROLE_KEY=sb_secret_...` desde o início. Ela não tem custo adicional e habilita a verificação real de slug, mas não é necessária para o CRUD autenticado do tenant criado manualmente.

Não crie as variáveis do Asaas com valores fictícios. O projeto não lê variáveis do Resend nesta fase.

Os leitores reais das variáveis estão em:

- `C:\Projeto-Github\CatalogoJá\src\lib\env\public.ts`
- `C:\Projeto-Github\CatalogoJá\src\lib\env\server.ts`
- `C:\Projeto-Github\CatalogoJá\next.config.ts`

## 5. Deploy na Vercel

1. Envie a pasta que contém `package.json` para um repositório GitHub. Neste workspace ela é `C:\Projeto-Github\CatalogoJá`.
2. Na Vercel, clique em **Add New → Project** e importe o repositório GitHub.
3. Confirme o preset **Next.js**.
4. Em **Root Directory**, selecione a pasta que contém `package.json`. Se `CatalogoJá` for a subpasta do repositório, selecione `CatalogoJá`; se ela for a raiz do repositório, mantenha `.`.
5. Em **Environment Variables**, adicione as três variáveis mínimas da seção anterior para **Production**. Adicione também em **Preview** se for testar branches e pull requests.
6. O valor de `NEXT_PUBLIC_SITE_URL` deve ser a URL final gerada pela Vercel: `https://NOME-DO-PROJETO.vercel.app`.
7. Clique em **Deploy**.
8. Depois do primeiro deploy, abra **Project → Settings → Domains**, confirme o domínio real e corrija `NEXT_PUBLIC_SITE_URL` se necessário.
9. Se alterar qualquer variável, faça um novo deploy; mudanças de environment variables não alteram deployments antigos.
10. Volte ao Supabase e configure **Site URL** e **Redirect URLs** com esse mesmo domínio.

A Vercel documenta o fluxo de importação em [Deploying Git Repositories](https://vercel.com/docs/git) e a configuração em [Environment Variables](https://vercel.com/docs/environment-variables).

## 6. Criar um tenant manual para testar sem pagamento

Sim. É possível criar um tenant diretamente no SQL Editor depois que o usuário existir no Supabase Auth.

Altere apenas o e-mail, o slug e os dados de exemplo abaixo. O bloco cria:

- tenant ativo;
- assinatura de teste sem IDs do Asaas;
- categoria inicial;
- produto inicial sem imagem.

```sql
begin;

do $$
declare
  v_owner_user_id uuid;
  v_tenant_id uuid;
  v_category_id uuid;
begin
  select id
    into v_owner_user_id
  from auth.users
  where lower(email) = lower('seu-email@exemplo.com')
  limit 1;

  if v_owner_user_id is null then
    raise exception 'Usuário não encontrado no Supabase Auth';
  end if;

  insert into public.tenants (
    slug,
    nome_loja,
    descricao_curta,
    whatsapp,
    instagram,
    endereco,
    tema,
    owner_user_id,
    status
  )
  values (
    'loja-teste',
    'Loja Teste',
    'Catálogo criado manualmente para validar o ambiente.',
    '5511999999999',
    'lojateste',
    'São Paulo - SP',
    'natural',
    v_owner_user_id,
    'ativo'
  )
  returning id into v_tenant_id;

  insert into public.subscriptions (
    tenant_id,
    valor,
    status,
    next_due_date
  )
  values (
    v_tenant_id,
    27.00,
    'ativo',
    current_date + 30
  );

  insert into public.categories (tenant_id, nome, ordem)
  values (v_tenant_id, 'Destaques', 0)
  returning id into v_category_id;

  insert into public.products (
    tenant_id,
    category_id,
    nome,
    preco,
    descricao,
    variacao_info,
    ativo,
    ordem
  )
  values (
    v_tenant_id,
    v_category_id,
    'Produto de teste',
    27.00,
    'Produto criado para validar o catálogo público.',
    'Variações sob consulta',
    true,
    0
  );
end
$$;

commit;
```

O WhatsApp deve estar no formato `55 + DDD + número`, somente com dígitos. O slug deve ser minúsculo, sem acentos e separado por hífens.

Depois de executar:

1. Abra `https://SEU-PROJETO.vercel.app/painel`.
2. No ambiente local, entre com o e-mail e a senha definidos manualmente no Supabase Auth.
3. Abra a loja em `https://SEU-PROJETO.vercel.app/loja/loja-teste`.

Para o ambiente de teste atual, também existe um seed repetível já
preenchido para `admin@gmail.com`:

- `C:\Projeto-Github\CatalogoJá\supabase\seed-test-tenant.sql`

O acesso de demonstração é separado do login real e fica habilitado por padrão. Defina `DEMO_ACCESS_ENABLED=false` para ocultá-lo.

## 7. Ativar pagamentos no Asaas Sandbox

O checkout recorrente usa a página hospedada pelo Asaas, com cartão de crédito, no valor de R$ 27 por mês. A primeira cobrança vence no dia da contratação e as seguintes usam o ciclo mensal. O Asaas não permite Pix no mesmo checkout do tipo `RECURRENT`; oferecer Pix exigiria um fluxo separado de cobrança avulsa e renovação manual.

### Estado da implementação

- `POST /api/checkout/asaas` valida os dados, reserva o slug em `signup_intents`, chama `POST /v3/checkouts` e redireciona para a página segura retornada pelo Asaas.
- Não é necessário criar cliente ou assinatura manualmente no painel. Ao concluir um checkout `RECURRENT`, o próprio Asaas cria o cliente e a assinatura mensal; os IDs são recebidos e persistidos pelo webhook.
- O token é validado no header `asaas-access-token`, em tempo constante, antes de o corpo JSON ser lido.
- `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED` e `CHECKOUT_PAID` ativam/provisionam a loja; `PAYMENT_OVERDUE` muda a assinatura para `atrasado` e o tenant para `inadimplente`; `SUBSCRIPTION_DELETED` e `SUBSCRIPTION_INACTIVATED` mudam ambos para `cancelado`.
- `CHECKOUT_CANCELED` e `CHECKOUT_EXPIRED` encerram a intenção ainda não provisionada.
- Cada evento é registrado por `event.id`. Reentregas não repetem o provisionamento. Eventos diferentes do mesmo pagamento também são reconciliados por `asaas_subscription_id` e, de forma controlada, por `asaas_customer_id`.
- Sem API key ou service role, a rota de checkout responde com erro de configuração `503`, sem derrubar as demais telas. Sem um token de webhook válido, o endpoint responde `401`; sem Supabase Admin, responde `503`.

O fluxo completo é:

1. `/cadastro` reserva o slug em `signup_intents`;
2. o backend cria o checkout recorrente no Asaas;
3. o comprador informa os dados restantes e o cartão na página hospedada;
4. o Asaas cria o cliente, a assinatura e a primeira cobrança;
5. o webhook confirma o pagamento;
6. o backend cria ou convida o usuário no Supabase Auth;
7. tenant e assinatura são criados uma única vez e a loja é liberada;
8. `/cadastro/sucesso` exibe os links quando o provisionamento terminar.

### Variáveis necessárias na Vercel

Além das variáveis públicas e do Supabase, configure como secrets do servidor:

```dotenv
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
ASAAS_API_KEY=SUA_CHAVE_DO_AMBIENTE
ASAAS_WEBHOOK_TOKEN=UM_SEGREDO_ALEATORIO_COM_32_A_255_CARACTERES
```

Com as chaves atuais, `ASAAS_API_URL` deve ficar vazia. O código reconhece automaticamente:

- `$aact_hmlg_...` → `https://api-sandbox.asaas.com/v3`;
- `$aact_prod_...` → `https://api.asaas.com/v3`.

Portanto, depois que o webhook também estiver cadastrado na conta de Produção, basta trocar `ASAAS_API_KEY` para mudar o ambiente, sem alteração de código. `ASAAS_WEBHOOK_TOKEN` só precisa mudar se você optar por usar tokens diferentes em Sandbox e Produção, o que é uma separação de segurança recomendável. Contas, chaves e configurações de webhook dos dois ambientes são independentes e não são copiadas automaticamente.

`ASAAS_API_URL` permanece apenas como compatibilidade para chaves antigas sem o prefixo do ambiente. Na dúvida, gere uma chave atual.

### Checklist manual no painel do Asaas

1. **Gerar a API key do Sandbox**
   - Entre em `https://sandbox.asaas.com` com um usuário administrador.
   - Abra o menu do usuário e acesse **Integrações → Chave da API**.
   - Clique em **Gerar nova chave da API**, copie no momento da criação e salve em `ASAAS_API_KEY` no ambiente local e na Vercel.
   - A chave atual do Sandbox começa com `$aact_hmlg_`. Não use essa chave em Produção.

2. **Preparar a API key de Produção, sem ativá-la ainda**
   - Entre na conta real pelo painel web do Asaas.
   - Acesse **Integrações → Chave da API** e gere uma chave exclusiva para a Vercel.
   - A chave atual de Produção começa com `$aact_prod_`. Guarde-a em local seguro e só substitua a variável depois da homologação completa.

3. **Gerar o token de autenticação do webhook**
   - Esse token é criado por você; ele não é fornecido pelo Asaas e nunca deve ser igual à API key.
   - Gere um segredo aleatório de 32 a 255 caracteres. Exemplo no PowerShell:

     ```powershell
     $bytes = New-Object byte[] 32
     [Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
     [Convert]::ToHexString($bytes).ToLower()
     ```

   - Salve primeiro o resultado em `ASAAS_WEBHOOK_TOKEN` na Vercel e faça o deploy. Depois cole exatamente o mesmo valor no campo **Token de autenticação** do webhook do Asaas.

4. **Cadastrar o webhook depois que o domínio estiver publicado**
   - No Sandbox, abra **Integrações → Webhooks**. Em versões anteriores do painel, o caminho pode aparecer como **Menu do usuário → Minha Conta → Integração → Webhook para cobranças**.
   - Crie um webhook chamado `CatalogoJa Sandbox`.
   - URL: `https://SEU-DOMINIO/api/webhooks/asaas` — por exemplo, `https://seu-projeto.vercel.app/api/webhooks/asaas`.
   - Informe um e-mail monitorado para alertas de falha.
   - Selecione **API v3**, mantenha o webhook ativo, a fila não interrompida e escolha envio **sequencial**.
   - Cole o mesmo `ASAAS_WEBHOOK_TOKEN` configurado na Vercel.
   - Marque somente: `CHECKOUT_PAID`, `CHECKOUT_CANCELED`, `CHECKOUT_EXPIRED`, `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `SUBSCRIPTION_DELETED` e `SUBSCRIPTION_INACTIVATED`.
   - Depois do primeiro teste, confira **Integrações → Logs de Webhooks** e confirme resposta HTTP `200`.

5. **Confirmar o Pix da conta**
   - O plano recorrente atual não usa Pix: a cobrança automática mensal está em cartão.
   - Para conferir a disponibilidade geral, abra **Menu do usuário → Minha conta → Configurações → Configurações do sistema** e confirme **Disponibilizar recebimento por Pix**.
   - Para cadastrar ou revisar a chave de recebimento, abra **menu lateral → Pix → Minhas chaves**.
   - Ativar Pix não o adiciona a este checkout recorrente. Isso dependerá de um fluxo separado no código.

6. **Cartões fictícios do Sandbox**
   - Aprovação: `4444 4444 4444 4444`.
   - Recusa Mastercard: `5184 0197 4037 3151`.
   - Recusa Visa: `4916 5613 5824 0741`.
   - Use qualquer validade futura e CVV `123`. Use somente dados fictícios/autorizados nos demais campos; o Sandbox não movimenta dinheiro real.

O webhook e os callbacks não devem apontar para `localhost`. Para o teste completo, use a URL HTTPS da Vercel ou um túnel HTTPS, atualize `NEXT_PUBLIC_SITE_URL` com a mesma origem e faça novo deploy.

### Teste guiado de ponta a ponta no Sandbox

1. Confirme que o schema está atualizado. Se o banco já existia antes desta revisão, execute `supabase/migrations/202608060004_asaas_customer_lookup.sql` no SQL Editor.
2. Na Vercel, configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ASAAS_API_KEY` e `ASAAS_WEBHOOK_TOKEN`; depois faça um novo deploy.
3. Cadastre o webhook do Sandbox usando a URL pública e o mesmo token.
4. Abra `https://SEU-DOMINIO/cadastro` em janela anônima.
5. Informe um nome de loja, WhatsApp com `55 + DDD + número`, um e-mail que você controla e um slug ainda não utilizado. Aceite termos e privacidade, avance e escolha o tema.
6. Clique em **Ir para pagamento seguro**. O navegador deve abrir o Checkout Asaas mostrando a assinatura de R$ 27/mês.
7. Preencha os campos do pagador com dados fictícios válidos e use o cartão aprovado `4444 4444 4444 4444`, validade futura e CVV `123`.
8. Após a aprovação, espere o retorno para `/cadastro/sucesso?ref=...`. Primeiro aparecerá “Estamos preparando sua loja”; após o webhook, a tela mudará para “Sua loja está no ar!” e exibirá os links da loja e do painel.
9. Em **Asaas Sandbox → Integrações → Logs de Webhooks**, confirme que `CHECKOUT_PAID` e/ou `PAYMENT_CONFIRMED` chegaram à URL com HTTP `200`.
10. No Supabase SQL Editor, confirme o provisionamento:

    ```sql
    select
      si.email,
      si.status as cadastro_status,
      si.asaas_customer_id,
      si.asaas_subscription_id,
      t.id as tenant_id,
      t.slug,
      t.status as tenant_status,
      s.status as assinatura_status,
      s.valor,
      s.next_due_date
    from public.signup_intents si
    left join public.tenants t on t.id = si.provisioned_tenant_id
    left join public.subscriptions s on s.tenant_id = t.id
    where lower(si.email) = lower('EMAIL-USADO-NO-TESTE')
    order by si.created_at desc
    limit 1;
    ```

    O resultado aprovado deve mostrar `cadastro_status = pago`, `tenant_status = ativo`, `assinatura_status = ativo`, valor `27.00` e IDs `cus_...`/`sub_...` preenchidos.

11. Abra **Supabase → Authentication → Users** e confirme que o usuário foi criado e marcado como confirmado. Nenhum e-mail será enviado. Nesta fase, o acesso do novo cliente ao painel fica pendente até a autenticação definitiva ser habilitada.
12. Repita com um slug/e-mail diferentes e um cartão de recusa. O checkout deve negar o pagamento e nenhum tenant ativo deve ser criado.
13. Antes de Produção, repita o cadastro do webhook na conta real do Asaas, substitua a API key na Vercel, faça novo deploy e realize uma transação real de valor controlado.

## 8. O que funciona nesta fase

### Funciona com Supabase + Vercel configurados, sem Asaas

- landing page, termos e política de privacidade;
- login local por e-mail e senha para um usuário criado manualmente no Supabase Auth;
- painel público de demonstração somente leitura, quando `DEMO_ACCESS_ENABLED=true`;
- isolamento multi-tenant pelas policies de RLS;
- painel da loja e edição de dados visuais;
- CRUD e reordenação de categorias;
- CRUD, publicação e remoção de produtos;
- upload de logo, banner e produtos no bucket `produtos`;
- catálogo público em `/loja/[slug]`;
- temas, busca, categorias e paginação client-side do catálogo;
- botões de pedido com mensagem pronta para o WhatsApp;
- tela de assinatura com dados inseridos manualmente.

Se `SUPABASE_SERVICE_ROLE_KEY` não for configurada, a verificação de disponibilidade do slug fica em modo informativo. Isso não impede o tenant manual nem o CRUD autenticado.

### Não funciona até o Asaas ser configurado

- abertura do checkout recorrente no final de `/cadastro`;
- confirmação real de pagamento em `/cadastro/sucesso`;
- criação automática do usuário no Supabase Auth;
- criação automática de tenant e assinatura pelo webhook;
- atualização automática de inadimplência e cancelamento;
- link real de cobrança/portal fornecido pelo Asaas;
- envio de convite, magic link ou e-mail de boas-vindas;
- acesso de novos clientes pagos ao painel até que uma forma de autenticação seja definida;

Sem Asaas, a interface de `/cadastro` pode ser preenchida e o preview funciona, mas o botão final retorna uma mensagem informando que o checkout ainda não foi configurado.

## 9. Mapa dos arquivos reais

| Finalidade | Caminho real |
|---|---|
| Este guia | `C:\Projeto-Github\CatalogoJá\SETUP.md` |
| Schema consolidado | `C:\Projeto-Github\CatalogoJá\supabase\schema.sql` |
| Seed do tenant de teste atual | `C:\Projeto-Github\CatalogoJá\supabase\seed-test-tenant.sql` |
| Migration inicial | `C:\Projeto-Github\CatalogoJá\supabase\migrations\202607180001_initial_schema.sql` |
| Função de status público | `C:\Projeto-Github\CatalogoJá\supabase\migrations\202607190002_functional_screens.sql` |
| Normalização do WhatsApp | `C:\Projeto-Github\CatalogoJá\supabase\migrations\202607190003_normalize_brazil_whatsapp.sql` |
| Índice de reconciliação Asaas | `C:\Projeto-Github\CatalogoJá\supabase\migrations\202608060004_asaas_customer_lookup.sql` |
| Exemplo de variáveis | `C:\Projeto-Github\CatalogoJá\.env.example` |
| Leitura de env pública | `C:\Projeto-Github\CatalogoJá\src\lib\env\public.ts` |
| Leitura de secrets | `C:\Projeto-Github\CatalogoJá\src\lib\env\server.ts` |
| Configuração do plano mensal | `C:\Projeto-Github\CatalogoJá\src\lib\billing\plan.ts` |
| Cliente do Checkout Asaas | `C:\Projeto-Github\CatalogoJá\src\lib\asaas\client.ts` |
| Rota que cria o Checkout | `C:\Projeto-Github\CatalogoJá\src\app\api\checkout\asaas\route.ts` |
| Webhook do Asaas | `C:\Projeto-Github\CatalogoJá\src\app\api\webhooks\asaas\route.ts` |
| Configuração de imagens Supabase | `C:\Projeto-Github\CatalogoJá\next.config.ts` |
| Callback preparado para autenticação futura | `C:\Projeto-Github\CatalogoJá\src\app\auth\callback\route.ts` |
| Upload de logo e banner | `C:\Projeto-Github\CatalogoJá\src\app\painel\(app)\loja\actions.ts` |
| Upload de produtos | `C:\Projeto-Github\CatalogoJá\src\app\painel\(app)\produtos\actions.ts` |

# CatalogoJá

SaaS multi-tenant de catálogo digital para comerciantes divulgarem produtos e receberem pedidos pelo WhatsApp.

## Estado atual

Etapa funcional concluída: landing comercial, assinatura em duas etapas, checkout recorrente, webhook idempotente, acesso por senha, painel completo e catálogo público multi-tenant. O projeto não envia e-mails: após o pagamento, o cliente cria a senha na própria tela de sucesso. O design system responsivo oferece seis temas.

As integrações não exigem chaves para o projeto compilar. Os clientes Supabase validam a configuração apenas quando uma operação de banco é executada.

## Requisitos

- Node.js 20.20 ou superior
- npm 10 ou superior
- Um projeto Supabase (necessário para autenticação, banco e uploads)
- Uma conta Asaas Sandbox (necessária para testar o checkout e os webhooks)

## Desenvolvimento local

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Preencha `.env.local` quando as credenciais estiverem disponíveis. Nunca envie esse arquivo para o Git. Sem as chaves, todas as páginas continuam abrindo com estados orientativos, mas login, banco e checkout ficam desativados.

## Rotas principais

- `/`: landing comercial;
- `/cadastro`: dados, slug em tempo real, tema e checkout;
- `/painel`: acesso real por e-mail e senha, sem envio de mensagens, além da demonstração pública;
- `/painel/loja`, `/painel/categorias`, `/painel/produtos`, `/painel/assinatura`;
- `/loja/[slug]`: catálogo público;
- `/api/webhooks/asaas`: sincronização de pagamento e provisionamento.

## Ativação das integrações

1. Aplique todas as migrações em `supabase/migrations`.
2. Copie `.env.example` para `.env.local` e informe as chaves.
3. No Supabase Auth, adicione `http://localhost:3000/auth/callback` às URLs permitidas em desenvolvimento.
4. No Asaas Sandbox, cadastre `https://SEU-DOMINIO/api/webhooks/asaas` e use exatamente o mesmo token de `ASAAS_WEBHOOK_TOKEN`.
5. Para testar webhooks localmente, use uma URL HTTPS pública de túnel e atualize `NEXT_PUBLIC_SITE_URL`.

O webhook trata confirmações, recebimentos, atrasos, cancelamentos e eventos do Checkout. Reentregas são registradas por `event_id`, impedindo provisionamento duplicado.

Os números de WhatsApp são exibidos como `+55 (11) 99999-9999` nos formulários e persistidos como `5511999999999`, formato necessário para os links `wa.me`.

## Verificações

```bash
npm run check
npm run build
```

`npm run check` executa lint, TypeScript e a validação automática de contraste AA das seis paletas.

## Design system

Tokens, temas e componentes reutilizáveis estão documentados em `docs/design-system.md`. A landing, o painel, o cadastro e a loja pública importam os mesmos controles, cards, estados e componentes de catálogo.

## Banco de dados

As migrações estão em `supabase/migrations`. Consulte `supabase/README.md` antes de aplicá-las.

begin;

-- A assinatura continua identificada de forma única por asaas_subscription_id.
-- O índice de cliente serve como fallback de reconciliação sem assumir que um
-- cliente só poderá ter uma assinatura ao longo do tempo.
create index if not exists subscriptions_asaas_customer_idx
  on public.subscriptions (asaas_customer_id)
  where asaas_customer_id is not null;

commit;

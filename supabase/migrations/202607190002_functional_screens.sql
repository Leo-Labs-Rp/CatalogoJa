begin;

-- O catálogo público omite lojas canceladas. Esta função expõe apenas o status
-- necessário para diferenciar uma loja cancelada de um slug inexistente.
create or replace function public.get_public_store_status(p_slug text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select tenant.status
  from public.tenants as tenant
  where tenant.slug = lower(btrim(p_slug));
$$;

revoke all on function public.get_public_store_status(text) from public;
grant execute on function public.get_public_store_status(text) to anon, authenticated;

comment on function public.get_public_store_status(text) is
  'Expõe somente o status necessário para a tela pública de indisponibilidade.';

commit;

-- Seed local de teste para o usuário confirmado admin@gmail.com.
-- Pode ser executado novamente: os registros existentes são reutilizados.

begin;

do $$
declare
  v_owner_user_id constant uuid := '88fbf6db-8e43-4205-9b13-bc5fad6b517b';
  v_tenant_id uuid;
  v_category_id uuid;
begin
  if not exists (
    select 1
    from auth.users
    where id = v_owner_user_id
      and lower(email) = 'admin@gmail.com'
  ) then
    raise exception 'Usuário admin@gmail.com não foi encontrado no Supabase Auth';
  end if;

  select id
    into v_tenant_id
  from public.tenants
  where owner_user_id = v_owner_user_id
  limit 1;

  if v_tenant_id is null then
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
      'loja-teste-admin',
      'Loja Teste Admin',
      'Catálogo criado para validar o ambiente Supabase.',
      '5511999999999',
      'lojatesteadmin',
      'São Paulo - SP',
      'natural',
      v_owner_user_id,
      'ativo'
    )
    returning id into v_tenant_id;
  end if;

  if not exists (
    select 1
    from public.subscriptions
    where tenant_id = v_tenant_id
      and status in ('ativo', 'atrasado')
  ) then
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
  end if;

  select id
    into v_category_id
  from public.categories
  where tenant_id = v_tenant_id
    and lower(btrim(nome)) = 'destaques'
  limit 1;

  if v_category_id is null then
    insert into public.categories (tenant_id, nome, ordem)
    values (v_tenant_id, 'Destaques', 0)
    returning id into v_category_id;
  end if;

  if not exists (
    select 1
    from public.products
    where tenant_id = v_tenant_id
      and category_id = v_category_id
      and nome = 'Produto de teste'
  ) then
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
  end if;
end
$$;

commit;

select
  id,
  slug,
  nome_loja,
  owner_user_id,
  status
from public.tenants
where owner_user_id = '88fbf6db-8e43-4205-9b13-bc5fad6b517b';

begin;

update public.tenants
set whatsapp = '55' || whatsapp
where whatsapp ~ '^[0-9]{10,11}$';

update public.signup_intents
set whatsapp = '55' || whatsapp
where whatsapp ~ '^[0-9]{10,11}$';

alter table public.tenants
  drop constraint tenants_whatsapp_format_check,
  add constraint tenants_whatsapp_format_check
    check (whatsapp ~ '^55[0-9]{10,11}$');

alter table public.signup_intents
  drop constraint signup_intents_whatsapp_check,
  add constraint signup_intents_whatsapp_check
    check (whatsapp ~ '^55[0-9]{10,11}$');

commit;

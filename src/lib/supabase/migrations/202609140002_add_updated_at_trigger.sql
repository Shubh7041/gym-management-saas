create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  return new;
end;
$$;

create trigger set_tenants_updated_at
before update on public.tenants
for each row
execute function public.handle_updated_at();

create trigger set_branches_updated_at
before update on public.branches
for each row
execute function public.handle_updated_at();

create trigger set_users_updated_at
before update on public.users
for each row
execute function public.handle_updated_at();

create trigger set_tenant_users_updated_at
before update on public.tenant_users
for each row
execute function public.handle_updated_at();
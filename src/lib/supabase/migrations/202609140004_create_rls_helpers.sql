create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    inner join public.tenant_users tu
      on tu.user_id = u.id
    inner join public.roles r
      on r.id = tu.role_id
    where u.auth_user_id = auth.uid()
      and r.name = 'platform_admin'
      and u.status = 'active'
      and tu.status = 'active'
  );
$$;

create or replace function public.has_tenant_access(
  requested_tenant_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.users u
      inner join public.tenant_users tu
        on tu.user_id = u.id
      where u.auth_user_id = auth.uid()
        and tu.tenant_id = requested_tenant_id
        and u.status = 'active'
        and tu.status = 'active'
    );
$$;


create or replace function public.has_branch_access(
  requested_branch_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.users u
      inner join public.tenant_users tu
        on tu.user_id = u.id
      where u.auth_user_id = auth.uid()
        and tu.branch_id = requested_branch_id
        and u.status = 'active'
        and tu.status = 'active'
    );
$$;
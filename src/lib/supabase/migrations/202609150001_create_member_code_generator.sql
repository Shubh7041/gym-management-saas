create table public.member_code_counters (
  tenant_id uuid primary key
    references public.tenants(id) on delete cascade,

  next_number integer not null
    check (next_number > 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


alter table public.member_code_counters enable row level security;


create policy "member_code_counters_select"
on public.member_code_counters
for select
to authenticated
using (
  public.has_tenant_access(tenant_id)
);


create or replace function public.generate_member_code(
  p_tenant_id uuid
)
returns varchar
language plpgsql
security definer
set search_path = public
as $$
declare
  v_number integer;
begin

  if not public.has_tenant_access(p_tenant_id) then
    raise exception 'Access denied for this tenant.';
  end if;

  insert into public.member_code_counters (
    tenant_id,
    next_number
  )
  values (
    p_tenant_id,

    coalesce(
      (
        select max(
          substring(member_code from '^MEM-([0-9]+)$')::integer
        ) + 2
        from public.members
        where tenant_id = p_tenant_id
          and member_code ~ '^MEM-[0-9]+$'
      ),
      2
    )
  )
  on conflict (tenant_id)
  do update
  set
    next_number = public.member_code_counters.next_number + 1,
    updated_at = now()
  returning next_number - 1
  into v_number;

  return 'MEM-' || lpad(v_number::text, 4, '0');

end;
$$;


revoke all on function public.generate_member_code(uuid)
from public;

grant execute on function public.generate_member_code(uuid)
to authenticated;
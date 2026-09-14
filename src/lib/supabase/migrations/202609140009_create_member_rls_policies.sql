-- =========================================================
-- MEMBERS
-- =========================================================

create policy "Users can view tenant members"
on public.members
for select
to authenticated
using (
  public.has_tenant_access(tenant_id)
);

create policy "Users can create tenant members"
on public.members
for insert
to authenticated
with check (
  public.has_tenant_access(tenant_id)
);

create policy "Users can update tenant members"
on public.members
for update
to authenticated
using (
  public.has_tenant_access(tenant_id)
)
with check (
  public.has_tenant_access(tenant_id)
);


-- =========================================================
-- MEMBERSHIP PLANS
-- =========================================================

create policy "Users can view tenant membership plans"
on public.membership_plans
for select
to authenticated
using (
  public.has_tenant_access(tenant_id)
);

create policy "Users can create tenant membership plans"
on public.membership_plans
for insert
to authenticated
with check (
  public.has_tenant_access(tenant_id)
);

create policy "Users can update tenant membership plans"
on public.membership_plans
for update
to authenticated
using (
  public.has_tenant_access(tenant_id)
)
with check (
  public.has_tenant_access(tenant_id)
);

-- =========================================================
-- PAYMENTS
-- =========================================================

create policy "Users can view tenant payments"
on public.payments
for select
to authenticated
using (
  public.has_tenant_access(tenant_id)
);

create policy "Users can create tenant payments"
on public.payments
for insert
to authenticated
with check (
  public.has_tenant_access(tenant_id)
);

create policy "Users can update tenant payments"
on public.payments
for update
to authenticated
using (
  public.has_tenant_access(tenant_id)
)
with check (
  public.has_tenant_access(tenant_id)
);
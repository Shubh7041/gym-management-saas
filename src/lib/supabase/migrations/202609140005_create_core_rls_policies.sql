-- =========================================================
-- TENANTS
-- =========================================================

create policy "Users can view their tenant"
on public.tenants
for select
to authenticated
using (
  public.has_tenant_access(id)
);


-- =========================================================
-- BRANCHES
-- =========================================================

create policy "Users can view their tenant branches"
on public.branches
for select
to authenticated
using (
  public.has_tenant_access(tenant_id)
);

create policy "Users can create branches for their tenant"
on public.branches
for insert
to authenticated
with check (
  public.has_tenant_access(tenant_id)
);

create policy "Users can update their tenant branches"
on public.branches
for update
to authenticated
using (
  public.has_tenant_access(tenant_id)
)
with check (
  public.has_tenant_access(tenant_id)
);


-- =========================================================
-- USERS
-- =========================================================

create policy "Users can view their own profile"
on public.users
for select
to authenticated
using (
  auth_user_id = auth.uid()
);


-- =========================================================
-- ROLES
-- =========================================================

create policy "Authenticated users can view roles"
on public.roles
for select
to authenticated
using (
  true
);


-- =========================================================
-- TENANT USERS
-- =========================================================

create policy "Users can view tenant memberships"
on public.tenant_users
for select
to authenticated
using (
  public.has_tenant_access(tenant_id)
);
-- =========================================================
-- Member Subscription RLS Policies
-- =========================================================

ALTER TABLE public.member_subscriptions ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------
-- SELECT
-- Users can view subscriptions belonging to their tenant
-- ---------------------------------------------------------
CREATE POLICY "member_subscriptions_select_tenant"
ON public.member_subscriptions
FOR SELECT
USING (
  has_tenant_access(tenant_id)
);


-- ---------------------------------------------------------
-- INSERT
-- Users can create subscriptions only for their tenant
-- ---------------------------------------------------------
CREATE POLICY "member_subscriptions_insert_tenant"
ON public.member_subscriptions
FOR INSERT
WITH CHECK (
  has_tenant_access(tenant_id)
);


-- ---------------------------------------------------------
-- UPDATE
-- Users can update subscriptions only within their tenant
-- ---------------------------------------------------------
CREATE POLICY "member_subscriptions_update_tenant"
ON public.member_subscriptions
FOR UPDATE
USING (
  has_tenant_access(tenant_id)
)
WITH CHECK (
  has_tenant_access(tenant_id)
);s
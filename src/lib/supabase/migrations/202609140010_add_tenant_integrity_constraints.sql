-- ============================================================
-- Tenant Integrity Constraints
-- Migration: 202609140010
-- Purpose:
-- Enforce that tenant-scoped records can only reference
-- records belonging to the same tenant.
-- ============================================================


-- ============================================================
-- 1. COMPOSITE UNIQUE KEYS
-- ============================================================
-- These allow us to create composite foreign keys using:
-- (tenant_id, id)
--
-- This is important for multi-tenant data isolation at the
-- database level, not only through RLS.


alter table public.branches
add constraint uq_branches_tenant_id_id
unique (tenant_id, id);


alter table public.members
add constraint uq_members_tenant_id_id
unique (tenant_id, id);


alter table public.membership_plans
add constraint uq_membership_plans_tenant_id_id
unique (tenant_id, id);


alter table public.member_subscriptions
add constraint uq_member_subscriptions_tenant_id_id
unique (tenant_id, id);


-- ============================================================
-- 2. MEMBERS → BRANCHES
-- ============================================================
-- Prevents this invalid situation:
--
-- Member belongs to Tenant A
-- but branch belongs to Tenant B
--
-- Both tenant_id values must match.


alter table public.members
add constraint fk_members_tenant_branch
foreign key (tenant_id, branch_id)
references public.branches (tenant_id, id);


-- ============================================================
-- 3. MEMBER SUBSCRIPTIONS → MEMBERS
-- ============================================================
-- Subscription and member must belong to the same tenant.


alter table public.member_subscriptions
add constraint fk_subscription_tenant_member
foreign key (tenant_id, member_id)
references public.members (tenant_id, id);


-- ============================================================
-- 4. MEMBER SUBSCRIPTIONS → MEMBERSHIP PLANS
-- ============================================================
-- Subscription and membership plan must belong to the same tenant.


alter table public.member_subscriptions
add constraint fk_subscription_tenant_plan
foreign key (tenant_id, plan_id)
references public.membership_plans (tenant_id, id);


-- ============================================================
-- 5. PAYMENTS → MEMBERS
-- ============================================================
-- Payment and member must belong to the same tenant.


alter table public.payments
add constraint fk_payment_tenant_member
foreign key (tenant_id, member_id)
references public.members (tenant_id, id);


-- ============================================================
-- 6. PAYMENTS → MEMBER SUBSCRIPTIONS
-- ============================================================
-- Payment and subscription must belong to the same tenant.
--
-- subscription_id is nullable, so a payment can exist without
-- being linked to a subscription.
--
-- PostgreSQL's default MATCH SIMPLE behavior allows the FK
-- check to be skipped when subscription_id is NULL.


alter table public.payments
add constraint fk_payment_tenant_subscription
foreign key (tenant_id, subscription_id)
references public.member_subscriptions (tenant_id, id);


-- ============================================================
-- END OF MIGRATION
-- ============================================================
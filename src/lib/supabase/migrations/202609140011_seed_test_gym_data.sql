-- ============================================================
-- Seed Test Gym Data
-- Migration: 202609140011
-- Purpose:
-- Create realistic test data for Test Gym A.
-- ============================================================


-- ============================================================
-- 1. CREATE MAIN BRANCH
-- ============================================================

insert into public.branches (
    tenant_id,
    name,
    address,
    phone,
    status
)
select
    id,
    'Main Branch',
    'Test Gym A Main Branch',
    '9999999991',
    'active'
from public.tenants
where slug = 'test-gym-a';


-- ============================================================
-- 2. CREATE MEMBERSHIP PLAN
-- ============================================================

insert into public.membership_plans (
    tenant_id,
    name,
    description,
    duration_days,
    price,
    status
)
select
    id,
    'Monthly',
    'Monthly gym membership plan',
    30,
    1500.00,
    'active'
from public.tenants
where slug = 'test-gym-a';


-- ============================================================
-- 3. CREATE TEST MEMBER
-- ============================================================

insert into public.members (
    tenant_id,
    branch_id,
    member_code,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    gender,
    address,
    join_date,
    status
)
select
    t.id,
    b.id,
    'MEM-0001',
    'Test',
    'Member',
    'testmember@example.com',
    '9999999993',
    '1995-06-15',
    'male',
    'Test Member Address',
    current_date,
    'active'
from public.tenants t
join public.branches b
    on b.tenant_id = t.id
where t.slug = 'test-gym-a'
  and b.name = 'Main Branch';


-- ============================================================
-- 4. CREATE MEMBER SUBSCRIPTION
-- ============================================================

insert into public.member_subscriptions (
    tenant_id,
    member_id,
    plan_id,
    start_date,
    end_date,
    amount,
    status
)
select
    t.id,
    m.id,
    p.id,
    current_date,
    current_date + 29,
    p.price,
    'active'
from public.tenants t
join public.members m
    on m.tenant_id = t.id
join public.membership_plans p
    on p.tenant_id = t.id
where t.slug = 'test-gym-a'
  and m.member_code = 'MEM-0001'
  and p.name = 'Monthly';


-- ============================================================
-- 5. CREATE PAYMENT
-- ============================================================

insert into public.payments (
    tenant_id,
    member_id,
    subscription_id,
    amount,
    payment_method,
    payment_date,
    transaction_reference,
    status,
    notes
)
select
    t.id,
    m.id,
    s.id,
    s.amount,
    'upi',
    now(),
    'TEST-UPI-0001',
    'completed',
    'Test payment for monthly membership'
from public.tenants t
join public.members m
    on m.tenant_id = t.id
join public.member_subscriptions s
    on s.tenant_id = t.id
   and s.member_id = m.id
where t.slug = 'test-gym-a'
  and m.member_code = 'MEM-0001';


-- ============================================================
-- END OF MIGRATION
-- ============================================================
create table public.members (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null
    references public.tenants(id)
    on delete cascade,

  branch_id uuid not null
    references public.branches(id)
    on delete restrict,

  member_code varchar(50) not null,

  first_name varchar(100) not null,
  last_name varchar(100),

  email varchar(255),
  phone varchar(20),

  date_of_birth date,

  gender varchar(20)
    check (gender in ('male', 'female', 'other')),

  address text,

  join_date date not null default current_date,

  profile_photo_url text,

  status varchar(20) not null default 'active'
    check (
      status in (
        'active',
        'inactive',
        'blocked'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (tenant_id, member_code)
);

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null
    references public.tenants(id)
    on delete cascade,

  name varchar(100) not null,

  description text,

  duration_days integer not null
    check (duration_days > 0),

  price numeric(12, 2) not null
    check (price >= 0),

  status varchar(20) not null default 'active'
    check (
      status in (
        'active',
        'inactive'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (tenant_id, name)
);

create table public.member_subscriptions (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null
    references public.tenants(id)
    on delete cascade,

  member_id uuid not null
    references public.members(id)
    on delete cascade,

  plan_id uuid not null
    references public.membership_plans(id)
    on delete restrict,

  start_date date not null,
  end_date date not null,

  amount numeric(12, 2) not null
    check (amount >= 0),

  status varchar(20) not null default 'active'
    check (
      status in (
        'active',
        'expired',
        'cancelled'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (end_date >= start_date)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null
    references public.tenants(id)
    on delete cascade,

  member_id uuid not null
    references public.members(id)
    on delete restrict,

  subscription_id uuid
    references public.member_subscriptions(id)
    on delete set null,

  amount numeric(12, 2) not null
    check (amount > 0),

  payment_method varchar(30) not null
    check (
      payment_method in (
        'cash',
        'upi',
        'card',
        'bank_transfer',
        'online'
      )
    ),

  payment_date timestamptz not null default now(),

  transaction_reference varchar(100),

  status varchar(20) not null default 'completed'
    check (
      status in (
        'pending',
        'completed',
        'failed',
        'refunded'
      )
    ),

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- INDEXES
-- =========================================================

create index idx_members_tenant_id
on public.members(tenant_id);

create index idx_members_branch_id
on public.members(branch_id);

create index idx_members_phone
on public.members(phone);

create index idx_members_status
on public.members(status);

create index idx_membership_plans_tenant_id
on public.membership_plans(tenant_id);

create index idx_membership_plans_status
on public.membership_plans(status);

create index idx_member_subscriptions_tenant_id
on public.member_subscriptions(tenant_id);

create index idx_member_subscriptions_member_id
on public.member_subscriptions(member_id);

create index idx_member_subscriptions_plan_id
on public.member_subscriptions(plan_id);

create index idx_member_subscriptions_end_date
on public.member_subscriptions(end_date);

create index idx_payments_tenant_id
on public.payments(tenant_id);

create index idx_payments_member_id
on public.payments(member_id);

create index idx_payments_subscription_id
on public.payments(subscription_id);

create index idx_payments_payment_date
on public.payments(payment_date);


-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================

create trigger set_members_updated_at
before update on public.members
for each row
execute function public.handle_updated_at();

create trigger set_membership_plans_updated_at
before update on public.membership_plans
for each row
execute function public.handle_updated_at();

create trigger set_member_subscriptions_updated_at
before update on public.member_subscriptions
for each row
execute function public.handle_updated_at();

create trigger set_payments_updated_at
before update on public.payments
for each row
execute function public.handle_updated_at();
create extension if not exists "pgcrypto";

create table public.tenants (
  id uuid primary key default gen_random_uuid(),

  name varchar(150) not null,
  slug varchar(100) not null unique,

  email varchar(255),
  phone varchar(20),
  address text,

  status varchar(20) not null default 'active'
    check (status in ('active', 'inactive', 'suspended')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null
    references public.tenants(id)
    on delete cascade,

  name varchar(150) not null,
  address text,
  phone varchar(20),

  status varchar(20) not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (tenant_id, name)
);

create table public.users (
  id uuid primary key default gen_random_uuid(),

  auth_user_id uuid not null unique
    references auth.users(id)
    on delete cascade,

  full_name varchar(150) not null,
  email varchar(255),
  phone varchar(20),

  status varchar(20) not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),

  name varchar(50) not null unique,
  description varchar(255),

  created_at timestamptz not null default now()
);

create table public.tenant_users (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null
    references public.tenants(id)
    on delete cascade,

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  role_id uuid not null
    references public.roles(id),

  branch_id uuid
    references public.branches(id)
    on delete set null,

  status varchar(20) not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (tenant_id, user_id)
);

insert into public.roles (name, description)
values
  ('platform_admin', 'Platform administrator'),
  ('gym_owner', 'Gym owner'),
  ('receptionist', 'Receptionist'),
  ('member', 'Gym member');


create index idx_branches_tenant_id
on public.branches(tenant_id);

create index idx_tenant_users_tenant_id
on public.tenant_users(tenant_id);

create index idx_tenant_users_user_id
on public.tenant_users(user_id);

create index idx_tenant_users_role_id
on public.tenant_users(role_id);

create index idx_tenant_users_branch_id
on public.tenant_users(branch_id);
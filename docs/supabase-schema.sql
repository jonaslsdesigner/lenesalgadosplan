-- Schema inicial do sistema Lene Salgados.
-- Execute no SQL Editor do Supabase depois de criar o projeto.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'funcionario', 'suporte');
create type public.order_status as enum ('novo', 'em_preparo', 'pronto', 'entregue', 'cancelado');
create type public.order_type as enum ('delivery', 'encomenda');
create type public.payment_method as enum ('pix', 'dinheiro', 'cartao');
create type public.financial_kind as enum ('entrada', 'saida_empresa', 'saida_pessoal');
create type public.stock_movement_type as enum ('entrada', 'saida', 'ajuste');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'funcionario',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text,
  birthday date,
  preferences text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  order_type public.order_type not null default 'delivery',
  status public.order_status not null default 'novo',
  payment_method public.payment_method,
  payment_received boolean not null default false,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) generated always as (subtotal + delivery_fee) stored,
  scheduled_at timestamptz,
  notes text,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  kind public.financial_kind not null,
  category text not null,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  entry_date date not null default current_date,
  order_id uuid references public.orders(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  current_quantity numeric(12,3) not null default 0,
  minimum_quantity numeric(12,3) not null default 0,
  unit text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inventory_items(id) on delete cascade,
  movement_type public.stock_movement_type not null,
  quantity numeric(12,3) not null check (quantity > 0),
  reason text not null,
  order_id uuid references public.orders(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  supplied_product text,
  delivery_time text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.supplier_purchases (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  purchased_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.monthly_reports (
  id uuid primary key default gen_random_uuid(),
  report_month date not null unique,
  total_sales numeric(12,2) not null default 0,
  company_expenses numeric(12,2) not null default 0,
  personal_expenses numeric(12,2) not null default 0,
  net_profit numeric(12,2) not null default 0,
  orders_count integer not null default 0,
  growth_percent numeric(8,2) not null default 0,
  created_at timestamptz not null default now()
);

create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at);
create index financial_entries_entry_date_idx on public.financial_entries(entry_date);
create index inventory_items_low_stock_idx on public.inventory_items(current_quantity, minimum_quantity);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.financial_entries enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.suppliers enable row level security;
alter table public.supplier_purchases enable row level security;
alter table public.monthly_reports enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles self read"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.current_user_role() in ('admin', 'suporte'));

create policy "admin support manage profiles"
on public.profiles for all
to authenticated
using (public.current_user_role() in ('admin', 'suporte'))
with check (public.current_user_role() in ('admin', 'suporte'));

create policy "orders read for team"
on public.orders for select
to authenticated
using (public.current_user_role() in ('admin', 'funcionario', 'suporte'));

create policy "orders write for team"
on public.orders for all
to authenticated
using (public.current_user_role() in ('admin', 'funcionario', 'suporte'))
with check (public.current_user_role() in ('admin', 'funcionario', 'suporte'));

create policy "admin support full customers"
on public.customers for all
to authenticated
using (public.current_user_role() in ('admin', 'suporte'))
with check (public.current_user_role() in ('admin', 'suporte'));

create policy "finance admin support full"
on public.financial_entries for all
to authenticated
using (public.current_user_role() in ('admin', 'suporte'))
with check (public.current_user_role() in ('admin', 'suporte'));

create policy "finance employee payment insert"
on public.financial_entries for insert
to authenticated
with check (
  public.current_user_role() = 'funcionario'
  and kind = 'entrada'
);

create policy "inventory admin support full"
on public.inventory_items for all
to authenticated
using (public.current_user_role() in ('admin', 'suporte'))
with check (public.current_user_role() in ('admin', 'suporte'));

create policy "inventory movements admin support full"
on public.inventory_movements for all
to authenticated
using (public.current_user_role() in ('admin', 'suporte'))
with check (public.current_user_role() in ('admin', 'suporte'));

create policy "suppliers admin support full"
on public.suppliers for all
to authenticated
using (public.current_user_role() in ('admin', 'suporte'))
with check (public.current_user_role() in ('admin', 'suporte'));

create policy "supplier purchases admin support full"
on public.supplier_purchases for all
to authenticated
using (public.current_user_role() in ('admin', 'suporte'))
with check (public.current_user_role() in ('admin', 'suporte'));

create policy "reports admin support read"
on public.monthly_reports for select
to authenticated
using (public.current_user_role() in ('admin', 'suporte'));

alter publication supabase_realtime add table public.orders;

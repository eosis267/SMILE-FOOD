-- ============================================================================
-- SMILE FOOD: Production Database Schema & ACID Transaction Ledger
-- Supabase Postgres Migration: 20261013000000_smile_food_init.sql
-- Multi-Vendor Marketplace, Multi-Role Auth, Double-Entry Escrow Ledger
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ----------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('customer', 'vendor', 'courier', 'ngo_donor', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type order_status as enum ('Pending', 'Completed', 'Failed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type escrow_status as enum ('LOCKED', 'RELEASED', 'REFUNDED');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type ledger_account as enum (
    'ESCROW_HOLDING',
    'VENDOR_PAYABLE',
    'COURIER_PAYABLE',
    'PLATFORM_REVENUE',
    'CUSTOMER_WALLET'
  );
exception
  when duplicate_object then null;
end $$;

-- ----------------------------------------------------------------------------
-- 2. USER PROFILES TABLE (Synced with auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  phone text,
  avatar_url text,
  role user_role not null default 'customer',
  wallet_balance numeric(12,2) not null default 0.00 check (wallet_balance >= 0),
  business_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security for profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins and ops lead can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 3. ORDERS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id text primary key, -- e.g. 'SF-84201'
  order_number text unique not null,
  customer_id uuid references public.profiles(id) on delete set null,
  vendor_id uuid references public.profiles(id) on delete set null,
  rider_id uuid references public.profiles(id) on delete set null,
  
  status order_status not null default 'Pending',
  state_machine_step text not null default 'Created', 
  -- Steps: Created -> PaymentEscrowLocked -> Dispatched -> Delivered -> Settled / Cancelled
  escrow_status escrow_status not null default 'LOCKED',
  
  food_subtotal numeric(10,2) not null default 0.00,
  delivery_fee numeric(10,2) not null default 0.00,
  service_fee numeric(10,2) not null default 0.00,
  total_amount numeric(10,2) not null default 0.00,
  
  region text not null default 'Downtown Lagos',
  payment_method text not null default 'Stripe Card',
  payment_ref text,
  
  items jsonb not null default '[]'::jsonb,
  customer_info jsonb not null default '{}'::jsonb,
  restaurant_info jsonb not null default '{}'::jsonb,
  split_payout jsonb not null default '{}'::jsonb,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security for orders
alter table public.orders enable row level security;

create policy "Customers can view their own orders"
  on public.orders for select
  using (auth.uid() = customer_id);

create policy "Vendors can view assigned orders"
  on public.orders for select
  using (auth.uid() = vendor_id);

create policy "Couriers can view assigned deliveries"
  on public.orders for select
  using (auth.uid() = rider_id);

create policy "Admins can view and manage all orders"
  on public.orders for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- 4. DOUBLE-ENTRY TRANSACTION LEDGER TABLE (ACID Financial Audit)
-- ----------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  order_id text references public.orders(id) on delete cascade,
  batch_id uuid not null default gen_random_uuid(),
  entry_type text not null check (entry_type in ('DEBIT', 'CREDIT')),
  account ledger_account not null,
  amount numeric(12,2) not null check (amount > 0),
  debit numeric(12,2) not null default 0.00 check (debit >= 0),
  credit numeric(12,2) not null default 0.00 check (credit >= 0),
  description text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security for transactions
alter table public.transactions enable row level security;

create policy "Admins can view all ledger transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- 5. WALLET TOP-UPS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.wallet_topups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric(10,2) not null check (amount > 0),
  method text not null, -- 'card', 'bank', 'ussd'
  reference text unique not null,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.wallet_topups enable row level security;

create policy "Users can view own topups"
  on public.wallet_topups for select
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 6. STORED PROCEDURES & ACID ESCROW FUNCTIONS
-- ----------------------------------------------------------------------------

-- Function: Trigger to create profile when new auth.users is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, wallet_balance)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer'),
    case when (new.raw_user_meta_data->>'role') = 'admin' then 1500.00 else 100.00 end
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger hook on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function: Atomically lock order payment into Escrow
create or replace function public.process_order_escrow_lock(
  p_order_id text,
  p_total_amount numeric,
  p_food_subtotal numeric,
  p_delivery_fee numeric,
  p_service_fee numeric
)
returns void as $$
declare
  v_batch_id uuid := gen_random_uuid();
begin
  -- 1. Debit customer funds (or gateway collection)
  insert into public.transactions (order_id, batch_id, entry_type, account, amount, debit, credit, description)
  values (p_order_id, v_batch_id, 'DEBIT', 'CUSTOMER_WALLET', p_total_amount, p_total_amount, 0.00, 'Order payment collected from customer');

  -- 2. Credit Escrow Holding Account
  insert into public.transactions (order_id, batch_id, entry_type, account, amount, debit, credit, description)
  values (p_order_id, v_batch_id, 'CREDIT', 'ESCROW_HOLDING', p_total_amount, 0.00, p_total_amount, 'Escrow funds locked pending delivery');

  -- 3. Update order state
  update public.orders
  set 
    status = 'Pending',
    state_machine_step = 'PaymentEscrowLocked',
    escrow_status = 'LOCKED',
    updated_at = now()
  where id = p_order_id;
end;
$$ language plpgsql security definer;

-- Function: Atomically release escrow split payouts on completed delivery
create or replace function public.release_order_escrow_split(
  p_order_id text
)
returns void as $$
declare
  v_order record;
  v_batch_id uuid := gen_random_uuid();
  v_vendor_cut numeric;
  v_courier_cut numeric;
  v_platform_cut numeric;
begin
  select * into v_order from public.orders where id = p_order_id for update;

  if not found then
    raise exception 'Order % not found', p_order_id;
  end if;

  if v_order.escrow_status != 'LOCKED' then
    raise exception 'Order % escrow is not in LOCKED state', p_order_id;
  end if;

  v_vendor_cut := coalesce((v_order.split_payout->>'vendor')::numeric, v_order.food_subtotal * 0.85);
  v_courier_cut := coalesce((v_order.split_payout->>'rider')::numeric, v_order.delivery_fee * 0.90);
  v_platform_cut := v_order.total_amount - v_vendor_cut - v_courier_cut;

  -- Debit Escrow Holding Account (Full order amount released)
  insert into public.transactions (order_id, batch_id, entry_type, account, amount, debit, credit, description)
  values (p_order_id, v_batch_id, 'DEBIT', 'ESCROW_HOLDING', v_order.total_amount, v_order.total_amount, 0.00, 'Escrow release upon verified delivery');

  -- Credit Vendor Payable
  insert into public.transactions (order_id, batch_id, entry_type, account, amount, debit, credit, description)
  values (p_order_id, v_batch_id, 'CREDIT', 'VENDOR_PAYABLE', v_vendor_cut, 0.00, v_vendor_cut, 'Food preparation payout to restaurant');

  -- Credit Courier Payable
  insert into public.transactions (order_id, batch_id, entry_type, account, amount, debit, credit, description)
  values (p_order_id, v_batch_id, 'CREDIT', 'COURIER_PAYABLE', v_courier_cut, 0.00, v_courier_cut, 'Delivery fee payout to courier');

  -- Credit Platform Revenue
  insert into public.transactions (order_id, batch_id, entry_type, account, amount, debit, credit, description)
  values (p_order_id, v_batch_id, 'CREDIT', 'PLATFORM_REVENUE', v_platform_cut, 0.00, v_platform_cut, 'Platform commission & processing fee');

  -- Update order record
  update public.orders
  set 
    status = 'Completed',
    state_machine_step = 'Settled',
    escrow_status = 'RELEASED',
    updated_at = now()
  where id = p_order_id;
end;
$$ language plpgsql security definer;

-- ----------------------------------------------------------------------------
-- 7. SEED DATA (Demonstration & Sandbox)
-- ----------------------------------------------------------------------------
insert into public.orders (
  id, order_number, status, state_machine_step, escrow_status, 
  food_subtotal, delivery_fee, service_fee, total_amount, 
  region, payment_method, payment_ref, 
  customer_info, restaurant_info, items, split_payout
) values 
(
  'SF-84201', '#SF-84201', 'Pending', 'PaymentEscrowLocked', 'LOCKED',
  42.50, 4.00, 2.50, 49.00,
  'Victoria Island, Lagos', 'Stripe Card', 'ch_3Mxq7729sSF',
  '{"name": "Adeola Williams", "phone": "+234 803 123 4567", "address": "14 Adeola Odeku St, VI"}'::jsonb,
  '{"name": "Mama Cass Restaurant", "location": "Victoria Island", "phone": "+234 802 999 1122"}'::jsonb,
  '[{"name": "Jollof Rice Special", "quantity": 2, "price": 14.00}, {"name": "Grilled Suya Wings", "quantity": 1, "price": 14.50}]'::jsonb,
  '{"vendor": 36.12, "rider": 3.60, "platform": 9.28}'::jsonb
),
(
  'SF-84156', '#SF-84156', 'Completed', 'Settled', 'RELEASED',
  35.00, 3.50, 2.00, 40.50,
  'Lekki Phase 1, Lagos', 'Bank Transfer', 'bt_9921448SF',
  '{"name": "Chukwuma Eze", "phone": "+234 812 555 7788", "address": "Block 12 Admiralty Way, Lekki"}'::jsonb,
  '{"name": "Sweet Sensation Kitchen", "location": "Lekki Phase 1", "phone": "+234 809 111 2233"}'::jsonb,
  '[{"name": "Pepper Soup & Yam", "quantity": 1, "price": 20.00}, {"name": "Fresh Chapman", "quantity": 2, "price": 15.00}]'::jsonb,
  '{"vendor": 29.75, "rider": 3.15, "platform": 7.60}'::jsonb
),
(
  'SF-84102', '#SF-84102', 'Pending', 'Dispatched', 'LOCKED',
  58.00, 5.00, 3.00, 66.00,
  'Ikoyi, Lagos', 'Stripe Card', 'ch_99182377SF',
  '{"name": "Fatima Bello", "phone": "+234 805 777 9900", "address": "8 Bourdillon Rd, Ikoyi"}'::jsonb,
  '{"name": "Terra Kulture Lounge", "location": "VI / Ikoyi", "phone": "+234 803 444 8899"}'::jsonb,
  '[{"name": "Catfish Pepper Soup", "quantity": 1, "price": 32.00}, {"name": "Fried Plantain & Asun", "quantity": 2, "price": 26.00}]'::jsonb,
  '{"vendor": 49.30, "rider": 4.50, "platform": 12.20}'::jsonb
)
on conflict (id) do nothing;

-- Enable Realtime publication for orders and profiles
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.transactions;

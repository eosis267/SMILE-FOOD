import { createClient } from '@supabase/supabase-js';

/**
 * SMILE FOOD — Supabase Client
 * 
 * To connect to a real Supabase project:
 * 1. Create a project at https://supabase.com
 * 2. Replace the values below with your project URL and anon key
 * 3. Or set environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 */

const SUPABASE_URL = 
  (typeof window !== 'undefined' && localStorage.getItem('smilefood_supabase_url')) || 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://placeholder.supabase.co';

const SUPABASE_ANON_KEY = 
  (typeof window !== 'undefined' && localStorage.getItem('smilefood_supabase_key')) || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Database Schema Reference (deploy via Supabase SQL Editor):
 * 
 * -- Users Profile Table (synced from auth.users)
 * create table public.profiles (
 *   id uuid references auth.users(id) on delete cascade primary key,
 *   full_name text,
 *   phone text,
 *   avatar_url text,
 *   role text check (role in ('customer', 'vendor', 'courier', 'ngo_donor', 'admin')) default 'customer',
 *   wallet_balance numeric(12,2) default 0.00,
 *   created_at timestamptz default now(),
 *   updated_at timestamptz default now()
 * );
 * alter table public.profiles enable row level security;
 * create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
 * create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
 * 
 * -- Orders Table
 * create table public.orders (
 *   id text primary key,
 *   order_number text unique not null,
 *   customer_id uuid references public.profiles(id),
 *   vendor_id uuid references public.profiles(id),
 *   rider_id uuid references public.profiles(id),
 *   status text check (status in ('Pending', 'Completed', 'Failed')) default 'Pending',
 *   state_machine_step text default 'Created',
 *   escrow_status text default 'LOCKED',
 *   food_subtotal numeric(10,2),
 *   delivery_fee numeric(10,2),
 *   service_fee numeric(10,2),
 *   total_amount numeric(10,2),
 *   region text,
 *   payment_method text,
 *   payment_ref text,
 *   items jsonb,
 *   customer_info jsonb,
 *   restaurant_info jsonb,
 *   split_payout jsonb,
 *   created_at timestamptz default now(),
 *   updated_at timestamptz default now()
 * );
 * alter table public.orders enable row level security;
 * 
 * -- Transactions / Ledger Table
 * create table public.transactions (
 *   id uuid default gen_random_uuid() primary key,
 *   order_id text references public.orders(id),
 *   entry_type text,
 *   account text,
 *   debit numeric(12,2) default 0,
 *   credit numeric(12,2) default 0,
 *   description text,
 *   created_at timestamptz default now()
 * );
 * alter table public.transactions enable row level security;
 * 
 * -- Wallet Top-ups Table
 * create table public.wallet_topups (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references public.profiles(id),
 *   amount numeric(10,2),
 *   method text,
 *   reference text,
 *   status text default 'completed',
 *   created_at timestamptz default now()
 * );
 */

export default supabase;

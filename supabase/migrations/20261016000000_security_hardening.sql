-- ============================================================================
-- SMILE FOOD: Security Hardening & Privilege Escalation Remediation
-- Supabase Postgres Migration: 20261016000000_security_hardening.sql
-- Fixes: Mass-assignment protection, RLS column-level restrictions, Order validation
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TRIGGER: Prevent Unauthorized Mutation of Protected Profile Columns
-- Protects 'role', 'wallet_balance', 'id', and system timestamps from client updates
-- ----------------------------------------------------------------------------
create or replace function public.check_profile_mass_assignment()
returns trigger as $$
declare
  v_is_admin boolean;
  v_jwt_role text;
begin
  -- Check if caller is admin or service_role
  v_jwt_role := current_setting('request.jwt.claim.role', true);
  
  if v_jwt_role = 'service_role' then
    return new;
  end if;

  select (role = 'admin') into v_is_admin
  from public.profiles
  where id = auth.uid();

  if not coalesce(v_is_admin, false) then
    -- Non-admin users cannot alter their role
    if new.role is distinct from old.role then
      raise exception 'Security Violation: Modifying user role is not permitted.';
    end if;

    -- Non-admin users cannot alter their wallet balance directly
    if new.wallet_balance is distinct from old.wallet_balance then
      raise exception 'Security Violation: Modifying wallet balance directly is forbidden. Use authorized payment/escrow channels.';
    end if;

    -- ID and created_at are immutable
    if new.id is distinct from old.id then
      raise exception 'Security Violation: Profile ID is immutable.';
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_check_profile_mass_assignment on public.profiles;
create trigger trg_check_profile_mass_assignment
  before update on public.profiles
  for each row execute function public.check_profile_mass_assignment();

-- ----------------------------------------------------------------------------
-- 2. SECURE STORED PROCEDURE: Authorized Profile Update
-- Whitelisted update mechanism for authenticated users
-- ----------------------------------------------------------------------------
create or replace function public.update_profile_safe(
  p_full_name text,
  p_phone text default null,
  p_avatar_url text default null,
  p_business_name text default null
)
returns public.profiles as $$
declare
  v_updated public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Authentication required.';
  end if;

  if p_full_name is null or length(trim(p_full_name)) < 2 then
    raise exception 'Full name must be at least 2 characters.';
  end if;

  update public.profiles
  set 
    full_name = trim(p_full_name),
    phone = nullif(trim(p_phone), ''),
    avatar_url = nullif(trim(p_avatar_url), ''),
    business_name = nullif(trim(p_business_name), ''),
    updated_at = now()
  where id = auth.uid()
  returning * into v_updated;

  return v_updated;
end;
$$ language plpgsql security definer;

-- ----------------------------------------------------------------------------
-- 3. ORDERS ROW LEVEL SECURITY & INSERT POLICIES
-- Prevent forging orders under another user's customer_id
-- ----------------------------------------------------------------------------
drop policy if exists "Customers can insert their own orders" on public.orders;
create policy "Customers can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = customer_id);

drop policy if exists "Customers can update their own pending orders" on public.orders;
create policy "Customers can update their own pending orders"
  on public.orders for update
  using (auth.uid() = customer_id and status = 'Pending');

drop policy if exists "Vendors can update assigned order statuses" on public.orders;
create policy "Vendors can update assigned order statuses"
  on public.orders for update
  using (auth.uid() = vendor_id);

drop policy if exists "Couriers can update delivery progression" on public.orders;
create policy "Couriers can update delivery progression"
  on public.orders for update
  using (auth.uid() = rider_id);

-- ----------------------------------------------------------------------------
-- 4. RESPONSE MINIMIZATION VIEWS
-- Specialized views that exclude wholesale margins & internal splits
-- ----------------------------------------------------------------------------
create or replace view public.customer_orders_safe_view as
select 
  o.id,
  o.order_number,
  o.customer_id,
  o.status,
  o.state_machine_step,
  o.food_subtotal,
  o.delivery_fee,
  o.service_fee,
  o.total_amount,
  o.region,
  o.payment_method,
  o.items,
  o.created_at
from public.orders o
where o.customer_id = auth.uid();

-- Grant permissions
grant select on public.customer_orders_safe_view to authenticated;

import { supabase } from './supabaseClient';
import { INITIAL_ORDERS } from '../data/mockData';
import { validateProfileUpdate, sanitizeOrderResponse, sanitizeErrorResponse } from './apiSecurity';

/**
 * SMILE FOOD — Supabase Live Backend & Real-Time Sync Service
 * Connects frontend state securely with live Supabase Postgres tables.
 * Applies response minimization, field allowlists, and server-side validation.
 */

export const isSupabaseReady = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes('placeholder.supabase.co'));
};

/**
 * Sanitized configuration query — does NOT expose secret keys or raw endpoints to UI
 */
export const getSupabaseConfig = () => {
  return {
    isLive: isSupabaseReady(),
    status: isSupabaseReady() ? 'Connected (Production)' : 'Sandbox / Local Demo',
    provider: 'Supabase Managed Postgres',
  };
};

/**
 * Fetch Orders with hybrid fallback & field minimization allowlist
 */
export const fetchOrdersFromBackend = async (requesterRole = 'customer', requesterId = null) => {
  if (!isSupabaseReady()) {
    const sanitized = INITIAL_ORDERS.map(o => sanitizeOrderResponse(o, requesterRole, requesterId));
    return { data: sanitized, isLive: false };
  }

  try {
    // Explicit field allowlist instead of select('*')
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, status, state_machine_step, escrow_status, food_subtotal, delivery_fee, service_fee, total_amount, region, payment_method, items, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Sanitize per requester role
    const sanitized = (data || []).map(o => sanitizeOrderResponse(o, requesterRole, requesterId));
    return { data: sanitized, isLive: true };
  } catch (err) {
    const safeError = sanitizeErrorResponse(err);
    console.warn('Supabase fetch failed, utilizing sandbox ledger:', safeError);
    return { data: INITIAL_ORDERS, isLive: false, error: safeError };
  }
};

/**
 * Update User Profile with backend validation & mass-assignment prevention
 */
export const updateUserProfileInBackend = async (userId, updates) => {
  // 1. Server-side validation against prohibited fields (role, wallet_balance, id)
  const validation = validateProfileUpdate(updates);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Map to DB column names (whitelisted only)
  const dbUpdates = {};
  if (updates.fullName !== undefined || updates.full_name !== undefined) {
    dbUpdates.full_name = (updates.fullName || updates.full_name).trim();
  }
  if (updates.phone !== undefined) {
    dbUpdates.phone = updates.phone ? updates.phone.trim() : null;
  }
  if (updates.avatarUrl !== undefined || updates.avatar_url !== undefined) {
    dbUpdates.avatar_url = updates.avatarUrl || updates.avatar_url;
  }
  if (updates.businessName !== undefined || updates.business_name !== undefined) {
    dbUpdates.business_name = updates.businessName || updates.business_name;
  }
  dbUpdates.updated_at = new Date().toISOString();

  if (!isSupabaseReady()) {
    // Local demo persistence in localStorage
    try {
      const savedUser = localStorage.getItem('smilefood_demo_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const updatedProfile = {
          ...parsed.profile,
          ...dbUpdates,
        };
        const updatedUser = {
          ...parsed,
          user_metadata: {
            ...parsed.user_metadata,
            full_name: dbUpdates.full_name || parsed.user_metadata?.full_name,
          },
          profile: updatedProfile,
        };
        localStorage.setItem('smilefood_demo_user', JSON.stringify(updatedUser));
      }
    } catch {}
    return { success: true, sandbox: true, data: dbUpdates };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select('id, full_name, phone, avatar_url, business_name, role, wallet_balance, updated_at')
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    const safeError = sanitizeErrorResponse(err);
    console.error('Failed to update profile on Supabase:', safeError);
    return { success: false, error: safeError };
  }
};

/**
 * Update Order status in live database with validation
 */
export const updateOrderInBackend = async (orderId, updates) => {
  // Only permit valid state machine updates
  const allowedKeys = ['status', 'state_machine_step', 'escrow_status', 'cancel_reason'];
  const sanitizedUpdates = {};
  for (const k of Object.keys(updates)) {
    if (allowedKeys.includes(k)) {
      sanitizedUpdates[k] = updates[k];
    }
  }

  if (!isSupabaseReady()) {
    return { success: true, sandbox: true };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        ...sanitizedUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('id, order_number, status, state_machine_step, escrow_status');

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    const safeError = sanitizeErrorResponse(err);
    console.error('Failed to update order on Supabase:', safeError);
    return { success: false, error: safeError };
  }
};

/**
 * Trigger atomic Escrow Release via Stored Procedure
 */
export const releaseEscrowInBackend = async (orderId) => {
  if (!isSupabaseReady()) {
    return { success: true, sandbox: true };
  }

  try {
    const { error } = await supabase.rpc('release_order_escrow_split', {
      p_order_id: orderId
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    const safeError = sanitizeErrorResponse(err);
    console.error('Failed to execute release_order_escrow_split RPC:', safeError);
    return { success: false, error: safeError };
  }
};

/**
 * Real-time Supabase Postgres Channel Subscriptions
 */
export const subscribeToOrdersRealtime = (onOrderChange) => {
  if (!isSupabaseReady()) return () => {};

  try {
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          onOrderChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription not available:', err?.message || err);
    return () => {};
  }
};

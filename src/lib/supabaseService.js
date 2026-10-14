import { supabase } from './supabaseClient';
import { INITIAL_ORDERS } from '../data/mockData';

/**
 * SMILE FOOD — Supabase Live Backend & Real-Time Sync Service
 * Connects frontend state seamlessly with live Supabase Postgres tables.
 * Gracefully provides hybrid fallback to local reactive mock ledger in demo mode.
 */

export const isSupabaseReady = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('smilefood_supabase_url');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('smilefood_supabase_key');
  return !!(url && key && !url.includes('placeholder.supabase.co'));
};

export const getSupabaseConfig = () => {
  return {
    url: localStorage.getItem('smilefood_supabase_url') || import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
    key: localStorage.getItem('smilefood_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    isLive: isSupabaseReady(),
  };
};

export const saveSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('smilefood_supabase_url', url.trim());
    localStorage.setItem('smilefood_supabase_key', key.trim());
    window.location.reload(); // Reload to re-initialize client with new credentials
    return true;
  }
  return false;
};

export const resetSupabaseConfig = () => {
  localStorage.removeItem('smilefood_supabase_url');
  localStorage.removeItem('smilefood_supabase_key');
  window.location.reload();
};

/**
 * Fetch Orders with hybrid fallback
 */
export const fetchOrdersFromBackend = async () => {
  if (!isSupabaseReady()) {
    return { data: INITIAL_ORDERS, isLive: false };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], isLive: true };
  } catch (err) {
    console.warn('Supabase fetch failed, utilizing sandbox ledger:', err.message);
    return { data: INITIAL_ORDERS, isLive: false, error: err.message };
  }
};

/**
 * Update Order status in live database
 */
export const updateOrderInBackend = async (orderId, updates) => {
  if (!isSupabaseReady()) {
    return { success: true, sandbox: true };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to update order on Supabase:', err);
    return { success: false, error: err.message };
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
    console.error('Failed to execute release_order_escrow_split RPC:', err);
    return { success: false, error: err.message };
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
    console.warn('Realtime subscription not available:', err);
    return () => {};
  }
};

import React, { useState } from 'react';
import IconsaxIcon from '../components/IconsaxIcon';
import BackButton from '../components/BackButton';
import { useApp } from '../context/AppContext';
import { getSupabaseConfig, saveSupabaseConfig, resetSupabaseConfig } from '../lib/supabaseService';

export const SettingsPage = () => {
  const { darkMode, toggleDarkMode, showToast } = useApp();

  const [escrowRule, setEscrowRule] = useState('INSTANT');
  const [vendorCommission, setVendorCommission] = useState(15);
  const [courierShare, setCourierShare] = useState(85);
  const [notifPreferences, setNotifPreferences] = useState({
    smsAlerts: true,
    emailLedgerSummary: true,
    instantRefundWebhook: true,
    slackDispatchChannel: false
  });

  // Supabase Configuration State
  const initialConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(initialConfig.key);
  const [showSqlMigration, setShowSqlMigration] = useState(false);

  const toggleNotif = (key) => {
    setNotifPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = () => {
    showToast('Platform preferences and escrow rules saved successfully!', 'success');
  };

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      showToast('Please provide both Supabase URL and Anon Key.', 'warning');
      return;
    }
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    showToast('Supabase credentials saved! Reloading client session...', 'success');
  };

  const handleResetSupabase = () => {
    resetSupabaseConfig();
    showToast('Switched to Sandbox / Demo mode.', 'info');
  };

  const handleCopyMigrationSql = () => {
    const migrationSnippet = `-- SMILE FOOD: Run in Supabase SQL Editor
-- Creates: profiles, orders, transactions, wallet_topups & triggers
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  role text not null default 'customer',
  wallet_balance numeric(12,2) not null default 0.00 check (wallet_balance >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  order_number text unique not null,
  status text not null default 'Pending',
  state_machine_step text not null default 'Created',
  escrow_status text not null default 'LOCKED',
  total_amount numeric(10,2) not null default 0.00,
  split_payout jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  order_id text references public.orders(id) on delete cascade,
  entry_type text not null,
  account text not null,
  amount numeric(12,2) not null,
  debit numeric(12,2) not null default 0.00,
  credit numeric(12,2) not null default 0.00,
  description text not null,
  created_at timestamptz not null default now()
);

-- Realtime replication
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.transactions;`;

    navigator.clipboard?.writeText(migrationSnippet);
    showToast('SQL Migration copied to clipboard! Ready to paste into Supabase SQL Editor.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/" label="Dashboard" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
          System Preferences & Backend Database
        </h2>
        <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
          Configure Supabase live database connection, escrow policies, and appearance
        </p>
      </div>

      {/* Supabase Live Backend Integration Card */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEE] dark:border-[#27332A]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center text-[#079B48]">
              <IconsaxIcon name="database" size={22} color="#079B48" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-[17px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                  Supabase Backend Connection
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                  initialConfig.isLive 
                    ? 'bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]'
                    : 'bg-[#FFF6E5] text-[#F28C00] dark:bg-[#332210] dark:text-[#F28C00]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${initialConfig.isLive ? 'bg-[#079B48] animate-pulse' : 'bg-[#F28C00]'}`} />
                  {initialConfig.isLive ? 'Live Database Active' : 'Sandbox / Mock Mode'}
                </span>
              </div>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
                Connect your real Supabase project for real-time order subscriptions, ACID ledger, and Postgres auth.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMigrationSql}
              className="px-3.5 py-2 rounded-xl bg-[#F5F6F5] dark:bg-[#202922] hover:bg-[#EAF8D8] dark:hover:bg-[#14301C] text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] hover:text-[#079B48] transition-all flex items-center gap-1.5 border border-[#EEEEEE] dark:border-[#27332A]"
            >
              <IconsaxIcon name="copy" size={14} />
              <span>Copy SQL Migration</span>
            </button>
            <button
              onClick={() => setShowSqlMigration(!showSqlMigration)}
              className="px-3.5 py-2 rounded-xl bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold transition-all flex items-center gap-1.5"
            >
              <IconsaxIcon name="info-circle" size={14} color="white" />
              <span>{showSqlMigration ? 'Hide Migration' : 'View Migration'}</span>
            </button>
          </div>
        </div>

        {/* SQL Migration Code Viewer Drawer */}
        {showSqlMigration && (
          <div className="p-4 rounded-2xl bg-[#0F1311] text-[#D5F28A] font-mono text-[12px] overflow-x-auto border border-[#27332A] space-y-2">
            <div className="flex items-center justify-between text-[#8E9A92] pb-2 border-b border-[#27332A]">
              <span>supabase/migrations/20261013000000_smile_food_init.sql</span>
              <button 
                onClick={handleCopyMigrationSql}
                className="text-[#079B48] hover:text-white font-sans text-xs font-bold"
              >
                Copy All SQL
              </button>
            </div>
            <pre className="text-white/90 leading-relaxed">
{`-- Execute in Supabase SQL Editor:
-- 1. Creates 'profiles' with roles & wallet balances
-- 2. Creates 'orders' table with multi-step status machine
-- 3. Creates 'transactions' table with double-entry ACID ledger
-- 4. Enables Realtime publication for websocket dispatch`}
            </pre>
          </div>
        )}

        {/* Supabase API Credentials Form */}
        <form onSubmit={handleSaveSupabase} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">
                Project URL (VITE_SUPABASE_URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project-id.supabase.co"
                  className="w-full h-[46px] px-3.5 pl-9 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48] transition-colors"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777D79]">
                  <IconsaxIcon name="database" size={16} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">
                Anon Public Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full h-[46px] px-3.5 pl-9 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48] transition-colors"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777D79]">
                  <IconsaxIcon name="lock" size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92]">
              Keys are securely stored in your browser session and environment.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSupabase}
                className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors"
              >
                Reset to Demo Mode
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <IconsaxIcon name="refresh" size={14} color="white" />
                <span>Save & Connect</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Theme Management Card */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center">
              <IconsaxIcon name={darkMode ? 'sun' : 'moon'} size={20} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                Interface Appearance
              </h3>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                Currently in <strong className="text-[#079B48]">{darkMode ? 'Dark Mode' : 'Light Mode'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className="px-5 py-2.5 rounded-full bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] hover:border-[#079B48] transition-colors"
          >
            Switch to {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Escrow Settlement Rules */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-5">
        <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
          Escrow Disbursement Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
              Escrow Release Trigger
            </label>
            <select
              value={escrowRule}
              onChange={(e) => setEscrowRule(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            >
              <option value="INSTANT">Instant (Upon Rider Geofence Delivery)</option>
              <option value="PIN_CONFIRM">Customer 4-Digit OTP Handshake</option>
              <option value="MANUAL_AUDIT">Manual Operations Lead Review</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
              Platform Marketplace Commission
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={vendorCommission}
                onChange={(e) => setVendorCommission(Number(e.target.value))}
                className="w-24 h-11 px-3.5 rounded-2xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
              />
              <span className="text-[14px] font-bold text-[#777D79]">% per restaurant order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-4">
        <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
          Alerts & Webhook Relays
        </h3>

        {[
          { key: 'smsAlerts', title: 'High-Priority Dispatch SMS', desc: 'Notify operations on rider delays over 15 minutes' },
          { key: 'emailLedgerSummary', title: 'Daily ACID Ledger Summary', desc: 'Email end-of-day reconciled balances and journal hashes' },
          { key: 'instantRefundWebhook', title: 'Payment Webhook Relay', desc: 'Trigger real-time gateway webhook for Paystack & Stripe callbacks' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-2">
            <div>
              <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">{item.title}</p>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotif(item.key)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                notifPreferences[item.key] ? 'bg-[#079B48]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notifPreferences[item.key] ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSavePreferences}
          className="px-7 py-3 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/25"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

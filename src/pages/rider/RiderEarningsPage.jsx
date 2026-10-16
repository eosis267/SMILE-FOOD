import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';

const WEEKLY_EARNINGS = [
  { day: 'Mon', amount: 6240, deliveries: 8 },
  { day: 'Tue', amount: 8420, deliveries: 12 },
  { day: 'Wed', amount: 5100, deliveries: 7 },
  { day: 'Thu', amount: 9800, deliveries: 14 },
  { day: 'Fri', amount: 11200, deliveries: 16 },
  { day: 'Sat', amount: 14500, deliveries: 20 },
  { day: 'Sun', amount: 7300, deliveries: 10 },
];

const PAYOUT_HISTORY = [
  { id: 'PO-001', date: '2026-10-12', amount: 38400, status: 'Paid', method: 'Bank Transfer' },
  { id: 'PO-002', date: '2026-10-05', amount: 41200, status: 'Paid', method: 'Bank Transfer' },
  { id: 'PO-003', date: '2026-09-28', amount: 29800, status: 'Paid', method: 'Bank Transfer' },
  { id: 'PO-004', date: '2026-09-21', amount: 35600, status: 'Paid', method: 'Bank Transfer' },
  { id: 'PO-005', date: '2026-09-14', amount: 27400, status: 'Paid', method: 'Bank Transfer' },
];

const EARNINGS_BREAKDOWN = [
  { label: 'Base Delivery Pay', amount: 42800, color: '#079B48' },
  { label: 'Customer Tips', amount: 8240, color: '#F28C00' },
  { label: 'Surge / Peak Bonus', amount: 3960, color: '#087F3C' },
  { label: 'Weekend Bonus', amount: 2400, color: '#D5F28A' },
];

const maxWeekly = Math.max(...WEEKLY_EARNINGS.map(d => d.amount));

export const RiderEarningsPage = () => {
  const { showToast } = useApp();

  const totalThisWeek = WEEKLY_EARNINGS.reduce((s, d) => s + d.amount, 0);
  const totalBreakdown = EARNINGS_BREAKDOWN.reduce((s, d) => s + d.amount, 0);

  const handleWithdraw = () => {
    showToast('Withdrawal of ₦57,400 initiated to your bank account!', 'success');
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/rider" label="Rider Hub" />
        </div>
        <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
          My Earnings
        </h1>
        <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
          Track your payouts, tips, and bonuses in real time.
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#014C32] to-[#079B48] rounded-[28px] p-7 text-white relative overflow-hidden shadow-2xl shadow-[#079B48]/20">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 bottom-0 w-40 h-40 rounded-full bg-[#D5F28A]/10 blur-xl pointer-events-none" />

        <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#D5F28A] mb-1 relative">Available Balance</p>
        <p className="text-[46px] font-black font-['Outfit'] tracking-tight relative leading-none mb-1">₦57,400</p>
        <p className="text-[13px] text-white/70 mb-6 relative">Last payout: Oct 12, 2026</p>

        <div className="grid grid-cols-3 gap-4 mb-6 relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-3 text-center">
            <p className="text-[22px] font-black font-['Outfit']">87</p>
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wide">Deliveries</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-3 text-center">
            <p className="text-[22px] font-black font-['Outfit']">4.9</p>
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wide">Avg Rating</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-3 text-center">
            <p className="text-[22px] font-black font-['Outfit']">98%</p>
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wide">On-time Rate</p>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          className="w-full py-3.5 rounded-[16px] bg-white text-[#079B48] text-[15px] font-extrabold hover:bg-[#EAF8D8] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
        >
          <IconsaxIcon name="bank" size={18} color="#079B48" />
          Withdraw to Bank
        </button>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] p-6">
        <h3 className="text-[15px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-5">October Earnings Breakdown</h3>
        <div className="space-y-4">
          {EARNINGS_BREAKDOWN.map((item) => {
            const pct = (item.amount / totalBreakdown) * 100;
            return (
              <div key={item.label}>
                <div className="flex justify-between text-[13px] font-semibold mb-1.5">
                  <span className="text-[#171917] dark:text-[#F0F5F2]">{item.label}</span>
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">₦{item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-[#F5F6F5] dark:bg-[#202922] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: item.color }}
                  />
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t border-[#EEEEEE] dark:border-[#27332A] flex justify-between">
            <span className="text-[14px] font-extrabold text-[#171917] dark:text-[#F0F5F2]">Total Earnings (Oct)</span>
            <span className="text-[16px] font-black text-[#079B48] font-['Outfit']">₦{totalBreakdown.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">This Week</h3>
          <p className="text-[15px] font-bold text-[#079B48]">₦{totalThisWeek.toLocaleString()}</p>
        </div>
        <div className="flex items-end gap-2 h-40">
          {WEEKLY_EARNINGS.map((d) => {
            const heightPct = (d.amount / maxWeekly) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-bold text-[#079B48] opacity-0 group-hover:opacity-100 transition-opacity">
                  ₦{(d.amount / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full rounded-t-[10px] bg-gradient-to-t from-[#079B48] to-[#D5F28A] hover:from-[#087F3C] transition-all cursor-default min-h-[8px]"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[11px] font-semibold text-[#777D79] dark:text-[#8E9A92]">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout History */}
      <div>
        <h3 className="text-[17px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-4">Payout History</h3>
        <div className="space-y-3">
          {PAYOUT_HISTORY.map((payout) => (
            <div key={payout.id} className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[18px] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center shrink-0">
                <IconsaxIcon name="bank" size={20} color="#079B48" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2]">{payout.method}</p>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">{payout.id} · {new Date(payout.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[15px] font-extrabold text-[#079B48]">₦{payout.amount.toLocaleString()}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8D8] text-[#079B48]">
                  {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderEarningsPage;

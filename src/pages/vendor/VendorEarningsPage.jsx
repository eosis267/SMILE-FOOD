import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';

const WEEKLY = [
  { day: 'Mon', amount: 125000 },
  { day: 'Tue', amount: 189000 },
  { day: 'Wed', amount: 142000 },
  { day: 'Thu', amount: 208000 },
  { day: 'Fri', amount: 267000 },
  { day: 'Sat', amount: 312000 },
  { day: 'Sun', amount: 174000 },
];

const PAYOUT_HISTORY = [
  { id: 'VPO-001', period: 'Oct 6 – Oct 12', gross: 1417000, commission: 212550, net: 1204450, status: 'Paid' },
  { id: 'VPO-002', period: 'Sep 29 – Oct 5', gross: 1280000, commission: 192000, net: 1088000, status: 'Paid' },
  { id: 'VPO-003', period: 'Sep 22 – Sep 28', gross: 980000, commission: 147000, net: 833000, status: 'Paid' },
];

const BREAKDOWN = [
  { label: 'Gross Revenue', value: 1417000, color: '#079B48' },
  { label: 'Platform Commission (15%)', value: -212550, color: '#D95353' },
  { label: 'Rider Payout (10%)', value: -141700, color: '#F28C00' },
  { label: 'Net Earnings', value: 1062750, color: '#014C32' },
];

const maxWeekly = Math.max(...WEEKLY.map(d => d.amount));

export const VendorEarningsPage = () => {
  const { showToast } = useApp();

  const handleWithdraw = () => showToast('Withdrawal of ₦1,062,750 initiated to your bank account!', 'success');

  return (
    <div className="space-y-7">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/vendor" label="Kitchen Dashboard" />
        </div>
        <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
          Revenue & Payouts
        </h1>
        <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
          Track your restaurant earnings, commissions, and payout history.
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#F28C00] to-[#E07000] rounded-[28px] p-7 text-white relative overflow-hidden shadow-2xl shadow-[#F28C00]/20">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#FFEAAA] mb-1">Available to Withdraw</p>
        <p className="text-[46px] font-black font-['Outfit'] tracking-tight leading-none mb-1">₦1,062,750</p>
        <p className="text-[13px] text-white/70 mb-6">Current week earnings (Oct 6 – Oct 12)</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-3.5">
            <p className="text-[12px] text-white/70 mb-0.5">Gross Revenue</p>
            <p className="text-[20px] font-black font-['Outfit']">₦1,417,000</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-3.5">
            <p className="text-[12px] text-white/70 mb-0.5">Commissions Deducted</p>
            <p className="text-[20px] font-black font-['Outfit']">₦354,250</p>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          className="w-full py-3.5 rounded-[16px] bg-white text-[#F28C00] text-[15px] font-extrabold hover:bg-[#FFF8E1] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
        >
          <IconsaxIcon name="bank" size={18} color="#F28C00" />
          Withdraw to Bank
        </button>
      </div>

      {/* Breakdown */}
      <div className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] p-6">
        <h3 className="text-[15px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-5">This Week's Breakdown</h3>
        <div className="space-y-4">
          {BREAKDOWN.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#F5F6F5] dark:border-[#202922] last:border-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2]">{item.label}</span>
              </div>
              <span className={`text-[14px] font-extrabold ${item.value < 0 ? 'text-[#D95353]' : 'text-[#079B48]'}`}>
                {item.value < 0 ? '-' : ''}₦{Math.abs(item.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-[14px] bg-[#F5F6F5] dark:bg-[#202922] text-[12px] text-[#777D79] dark:text-[#8E9A92]">
          Platform commission is 15%. Rider payout (10%) is handled by SMILE FOOD escrow split.
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">7-Day Revenue</h3>
          <p className="text-[14px] font-bold text-[#F28C00]">₦{WEEKLY.reduce((s, d) => s + d.amount, 0).toLocaleString()}</p>
        </div>
        <div className="flex items-end gap-2 h-36">
          {WEEKLY.map((d) => {
            const h = (d.amount / maxWeekly) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-bold text-[#F28C00] opacity-0 group-hover:opacity-100 transition-opacity">
                  ₦{(d.amount / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full rounded-t-[8px] bg-gradient-to-t from-[#F28C00] to-[#FFEAAA] hover:opacity-80 transition-opacity cursor-default min-h-[8px]"
                  style={{ height: `${h}%` }}
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
          {PAYOUT_HISTORY.map((p) => (
            <div key={p.id} className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[18px] p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2]">{p.period}</p>
                  <p className="text-[11px] font-mono text-[#AAAAAA]">{p.id}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EAF8D8] text-[#079B48]">{p.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#F5F6F5] dark:bg-[#202922] rounded-[10px] p-2">
                  <p className="text-[10px] text-[#777D79] font-semibold">Gross</p>
                  <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">₦{(p.gross/1000).toFixed(0)}k</p>
                </div>
                <div className="bg-[#FDECEC] rounded-[10px] p-2">
                  <p className="text-[10px] text-[#D95353] font-semibold">Commission</p>
                  <p className="text-[13px] font-bold text-[#D95353]">-₦{(p.commission/1000).toFixed(0)}k</p>
                </div>
                <div className="bg-[#EAF8D8] dark:bg-[#14301C] rounded-[10px] p-2">
                  <p className="text-[10px] text-[#079B48] font-semibold">Net</p>
                  <p className="text-[13px] font-bold text-[#079B48]">₦{(p.net/1000).toFixed(0)}k</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorEarningsPage;

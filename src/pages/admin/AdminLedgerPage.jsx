import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';

const INITIAL_LEDGER_ENTRIES = [
  { id: 'tx-101', orderId: '#SF-84201', time: '14:32:10', batch: 'b-991', entry: 'CREDIT', account: 'ESCROW_HOLDING', debit: 0.00, credit: 49.00, desc: 'Order payment collected from Adeola Williams' },
  { id: 'tx-102', orderId: '#SF-84201', time: '14:32:10', batch: 'b-991', entry: 'DEBIT', account: 'CUSTOMER_WALLET', debit: 49.00, credit: 0.00, desc: 'Debit customer wallet for order authorization' },
  { id: 'tx-103', orderId: '#SF-84156', time: '11:15:22', batch: 'b-992', entry: 'DEBIT', account: 'ESCROW_HOLDING', debit: 40.50, credit: 0.00, desc: 'Escrow release upon verified delivery' },
  { id: 'tx-104', orderId: '#SF-84156', time: '11:15:22', batch: 'b-992', entry: 'CREDIT', account: 'VENDOR_PAYABLE (85%)', debit: 0.00, credit: 29.75, desc: 'Vendor net food preparation payout' },
  { id: 'tx-105', orderId: '#SF-84156', time: '11:15:22', batch: 'b-992', entry: 'CREDIT', account: 'COURIER_PAYABLE (10%)', debit: 0.00, credit: 4.05, desc: 'Rider delivery commission payout' },
  { id: 'tx-106', orderId: '#SF-84156', time: '11:15:22', batch: 'b-992', entry: 'CREDIT', account: 'PLATFORM_REVENUE (5%)', debit: 0.00, credit: 6.70, desc: 'Platform service fee & escrow fee' },
  { id: 'tx-107', orderId: '#SF-83990', time: '09:20:00', batch: 'b-993', entry: 'DEBIT', account: 'ESCROW_HOLDING', debit: 38.00, credit: 0.00, desc: 'Escrow release upon verified delivery' },
  { id: 'tx-108', orderId: '#SF-83990', time: '09:20:00', batch: 'b-993', entry: 'CREDIT', account: 'VENDOR_PAYABLE (85%)', debit: 0.00, credit: 28.05, desc: 'Vendor net food preparation payout' },
  { id: 'tx-109', orderId: '#SF-83990', time: '09:20:00', batch: 'b-993', entry: 'CREDIT', account: 'COURIER_PAYABLE (10%)', debit: 0.00, credit: 3.80, desc: 'Rider delivery commission payout' },
  { id: 'tx-110', orderId: '#SF-83990', time: '09:20:00', batch: 'b-993', entry: 'CREDIT', account: 'PLATFORM_REVENUE (5%)', debit: 0.00, credit: 6.15, desc: 'Platform service fee & escrow fee' },
];

export const AdminLedgerPage = () => {
  const { showToast } = useApp();
  const [filter, setFilter] = useState('ALL');
  const [entries, setEntries] = useState(INITIAL_LEDGER_ENTRIES);

  // Financial Split Metrics
  const totalVolume = 61650.00;
  const platformCommission = totalVolume * 0.05; // 5%
  const vendorPayouts = totalVolume * 0.85;      // 85%
  const riderCommissions = totalVolume * 0.10;   // 10%

  const filteredEntries = entries.filter(e => {
    if (filter === 'ALL') return true;
    if (filter === 'ESCROW') return e.account.includes('ESCROW');
    if (filter === 'VENDOR') return e.account.includes('VENDOR');
    if (filter === 'RIDER') return e.account.includes('COURIER');
    if (filter === 'PLATFORM') return e.account.includes('PLATFORM');
    return true;
  });

  const handleExportCsv = () => {
    const csvHeader = "ID,Order,Time,Batch,Entry,Account,Debit,Credit,Description\n";
    const csvRows = entries.map(e => `"${e.id}","${e.orderId}","${e.time}","${e.batch}","${e.entry}","${e.account}",${e.debit},${e.credit},"${e.desc}"`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smile_food_financial_ledger_${Date.now()}.csv`;
    a.click();
    showToast('ACID Double-Entry Ledger exported to CSV!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/admin" label="Dashboard" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Financial Ledger & Income Management
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            Monitor platform cash flow, 5% admin commission, and automated 85%/10% escrow disbursements
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="h-11 px-5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <IconsaxIcon name="export" size={16} color="white" />
          <span>Export Ledger Journal</span>
        </button>
      </div>

      {/* Financial Split Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="smile-card p-5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[28px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">Gross Cash Flow</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center">
              <IconsaxIcon name="wallet" size={16} />
            </div>
          </div>
          <div className="text-[28px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-1">100% Total order volume</p>
        </div>

        {/* Platform 5% Commission */}
        <div className="smile-card p-5 bg-gradient-to-br from-[#079B48] to-[#087F3C] text-white rounded-[28px] shadow-lg shadow-[#079B48]/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#D5F28A]">Admin Commission (5%)</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <IconsaxIcon name="trend-up" size={16} color="white" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-['Outfit']">
            ${platformCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-white/80 mt-1">Net platform operating profit</p>
        </div>

        {/* Vendor 85% Payout */}
        <div className="smile-card p-5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[28px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">Vendor Payouts (85%)</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF6E5] text-[#F28C00] flex items-center justify-center">
              <IconsaxIcon name="shop" size={16} />
            </div>
          </div>
          <div className="text-[28px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            ${vendorPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-1">Settled to restaurant kitchens</p>
        </div>

        {/* Rider 10% Commission */}
        <div className="smile-card p-5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[28px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">Rider Earnings (10%)</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F1FC] text-[#087F3C] flex items-center justify-center">
              <IconsaxIcon name="scooter" size={16} />
            </div>
          </div>
          <div className="text-[28px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            ${riderCommissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-1">Disbursed to courier fleet</p>
        </div>
      </div>

      {/* Account Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Journal Entries' },
          { id: 'ESCROW', label: 'Escrow Holdings' },
          { id: 'VENDOR', label: 'Vendor Payables (85%)' },
          { id: 'RIDER', label: 'Rider Payables (10%)' },
          { id: 'PLATFORM', label: 'Platform Revenue (5%)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-2xl text-[13px] font-bold transition-all shrink-0 ${
              filter === tab.id
                ? 'bg-[#079B48] text-white shadow-sm'
                : 'bg-white dark:bg-[#181F1A] text-[#777D79] dark:text-[#8E9A92] hover:bg-[#EAF8D8] hover:text-[#079B48] border border-[#EEEEEE] dark:border-[#27332A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Journal Table */}
      <div className="smile-card bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EEEEEE] dark:border-[#27332A] bg-[#FAFAFA] dark:bg-[#141A16] text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
                <th className="py-4 px-6">Tx ID & Order</th>
                <th className="py-4 px-6">Account</th>
                <th className="py-4 px-6">Entry Type</th>
                <th className="py-4 px-6">Debit ($)</th>
                <th className="py-4 px-6">Credit ($)</th>
                <th className="py-4 px-6">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE] dark:divide-[#27332A] text-[13px]">
              {filteredEntries.map(tx => (
                <tr key={tx.id} className="hover:bg-[#F5F6F5]/60 dark:hover:bg-[#202922]/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#171917] dark:text-[#F0F5F2] font-mono">{tx.id}</p>
                    <p className="text-[11px] text-[#079B48] font-bold">{tx.orderId} · {tx.time}</p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#171917] dark:text-[#F0F5F2]">
                    {tx.account}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      tx.entry === 'CREDIT' ? 'bg-[#EAF8D8] text-[#079B48]' : 'bg-[#FFF6E5] text-[#F28C00]'
                    }`}>
                      {tx.entry}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-[#171917] dark:text-[#F0F5F2]">
                    {tx.debit > 0 ? `$${tx.debit.toFixed(2)}` : '—'}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-[#079B48]">
                    {tx.credit > 0 ? `$${tx.credit.toFixed(2)}` : '—'}
                  </td>
                  <td className="py-4 px-6 text-[#777D79] dark:text-[#8E9A92]">
                    {tx.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLedgerPage;

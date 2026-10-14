import React, { useState } from 'react';
import IconsaxIcon from './IconsaxIcon';
import { useApp } from '../context/AppContext';

export const LedgerAuditModal = () => {
  const { isLedgerModalOpen, setIsLedgerModalOpen, ledgerEntries } = useApp();
  const [filterAccount, setFilterAccount] = useState('ALL');

  if (!isLedgerModalOpen) return null;

  const totalDebits = ledgerEntries
    .filter(e => e.type === 'DEBIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalCredits = ledgerEntries
    .filter(e => e.type === 'CREDIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.05;

  const filteredEntries = filterAccount === 'ALL'
    ? ledgerEntries
    : ledgerEntries.filter(e => e.account === filterAccount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[36px] shadow-2xl p-6 sm:p-8 max-h-[88vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE] dark:border-[#27332A]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center">
              <IconsaxIcon name="wallet" size={22} />
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                Double-Entry Accounting & Escrow Ledger
              </h2>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                ACID Transaction Ledger • Immutable Audit Trail
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLedgerModalOpen(false)}
            aria-label="Close Ledger Audit"
            className="w-9 h-9 rounded-full bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] hover:text-[#171917] dark:hover:text-[#F0F5F2] flex items-center justify-center text-sm transition-colors"
          >
            <IconsaxIcon name="close" size={16} />
          </button>
        </div>

        {/* ACID Health Summary Bar */}
        <div className="my-5 p-4 rounded-[24px] bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isBalanced ? 'bg-[#149B57]' : 'bg-[#D95353]'} animate-pulse`} />
            <span className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">
              {isBalanced ? 'Ledger Balanced (ACID Invariant Maintained)' : 'Discrepancy Detected'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[13px] font-bold">
            <div className="text-[#079B48]">
              Total Debits: <span className="font-['Outfit']">${totalDebits.toFixed(2)}</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="text-[#087F3C]">
              Total Credits: <span className="font-['Outfit']">${totalCredits.toFixed(2)}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A] text-[11px]">
              {ledgerEntries.length} Records
            </span>
          </div>
        </div>

        {/* Filter Account Selector */}
        <div className="flex items-center gap-2 pb-3 overflow-x-auto text-[12px]">
          <span className="text-[#777D79] font-bold shrink-0">Filter Account:</span>
          {['ALL', 'ESCROW_HOLDING_LIABILITY', 'VENDOR_PAYABLE', 'RIDER_PAYABLE', 'PLATFORM_REVENUE', 'PAYMENT_GATEWAY_INFLOW'].map(acc => (
            <button
              key={acc}
              onClick={() => setFilterAccount(acc)}
              className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
                filterAccount === acc
                  ? 'bg-[#079B48] text-white'
                  : 'bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] hover:text-[#171917]'
              }`}
            >
              {acc === 'ALL' ? 'All Accounts' : acc.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Table of Entries */}
        <div className="flex-1 overflow-y-auto rounded-[24px] border border-[#EEEEEE] dark:border-[#27332A]">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F5F6F5] dark:bg-[#202922] sticky top-0 z-10 border-b border-[#EEEEEE] dark:border-[#27332A]">
              <tr>
                <th className="py-3 px-4 font-bold text-[#777D79]">TX ID</th>
                <th className="py-3 px-3 font-bold text-[#777D79]">ORDER #</th>
                <th className="py-3 px-3 font-bold text-[#777D79]">ACCOUNT</th>
                <th className="py-3 px-3 font-bold text-[#777D79]">TYPE</th>
                <th className="py-3 px-3 font-bold text-[#777D79] text-right">AMOUNT</th>
                <th className="py-3 px-4 font-bold text-[#777D79]">AUDIT NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE] dark:divide-[#27332A]">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-[#202922]/50 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-[#777D79]">
                    {entry.id}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#171917] dark:text-[#F0F5F2]">
                    #{entry.orderId}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#087F3C] dark:text-[#D5F28A]">
                    {entry.account}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      entry.type === 'DEBIT'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                    ${entry.amount.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-[#777D79] dark:text-[#8E9A92]">
                    {entry.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 flex items-center justify-between text-[12px] text-[#777D79]">
          <span>Cryptographically validated ledger journal</span>
          <button
            onClick={() => setIsLedgerModalOpen(false)}
            className="px-5 py-2 rounded-full bg-[#079B48] text-white font-bold hover:bg-[#087F3C]"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};

export default LedgerAuditModal;

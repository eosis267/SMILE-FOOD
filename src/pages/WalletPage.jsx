import React, { useState } from 'react';
import IconsaxIcon from '../components/IconsaxIcon';
import BackButton from '../components/BackButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const WALLET_TRANSACTIONS = [
  { id: 'wt-001', type: 'credit', description: 'Escrow release — Order #SF-84201', amount: 42.50, date: '2026-10-12 14:32', ref: 'ESC-84201', balance: 1500.00 },
  { id: 'wt-002', type: 'credit', description: 'Escrow release — Order #SF-84156', amount: 35.00, date: '2026-10-12 11:15', ref: 'ESC-84156', balance: 1457.50 },
  { id: 'wt-003', type: 'debit', description: 'Withdrawal to bank — GTB ****4521', amount: 200.00, date: '2026-10-11 18:00', ref: 'WDR-20241011', balance: 1422.50 },
  { id: 'wt-004', type: 'credit', description: 'Top-up via Stripe Card', amount: 500.00, date: '2026-10-11 09:30', ref: 'TPU-STRIPE-0011', balance: 1622.50 },
  { id: 'wt-005', type: 'credit', description: 'Escrow release — Order #SF-83990', amount: 28.75, date: '2026-10-10 20:15', ref: 'ESC-83990', balance: 1122.50 },
  { id: 'wt-006', type: 'debit', description: 'Platform commission deduction', amount: 6.80, date: '2026-10-10 20:15', ref: 'COM-83990', balance: 1093.75 },
  { id: 'wt-007', type: 'credit', description: 'Referral bonus — MIKE-50', amount: 50.00, date: '2026-10-09 12:00', ref: 'REF-MIKE50', balance: 1100.55 },
  { id: 'wt-008', type: 'debit', description: 'Withdrawal to bank — GTB ****4521', amount: 100.00, date: '2026-10-08 15:30', ref: 'WDR-20241008', balance: 1050.55 },
];

const TOP_UP_AMOUNTS = [500, 1000, 2500, 5000];
const PAYMENT_METHODS = [
  { id: 'card', label: 'Debit/Credit Card', icon: 'card' },
  { id: 'bank', label: 'Bank Transfer', icon: 'bank' },
  { id: 'ussd', label: 'USSD / Mobile Money', icon: 'mobile' },
];

const WalletPage = () => {
  const { showToast } = useApp();
  const { walletBalance, displayName } = useAuth();

  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txFilter, setTxFilter] = useState('all'); // 'all' | 'credit' | 'debit'

  const balance = walletBalance || 1500.00;
  const totalEarned = WALLET_TRANSACTIONS.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = WALLET_TRANSACTIONS.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  const filteredTx = WALLET_TRANSACTIONS.filter(t => txFilter === 'all' || t.type === txFilter);

  const handleTopUp = async () => {
    const amount = parseFloat(customAmount || topUpAmount);
    if (!amount || amount <= 0) {
      showToast('Please select or enter a valid top-up amount.', 'error');
      return;
    }
    if (amount < 100) {
      showToast('Minimum top-up amount is $100.', 'warning');
      return;
    }

    setIsProcessing(true);
    // Simulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);

    showToast(`Successfully topped up $${amount.toFixed(2)} via ${PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}!`, 'success');
    setShowTopUp(false);
    setTopUpAmount('');
    setCustomAmount('');
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton fallbackTo="/" label="Dashboard" />
          <div>
            <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
              Wallet & Payments
            </h2>
            <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
              Manage your balance, top-ups, and transaction history
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowTopUp(true)}
          className="h-[44px] px-6 rounded-[30px] bg-[#014C32] hover:bg-[#038B5C] text-white text-[14px] font-bold transition-all active:scale-[0.97] shadow-md shadow-[#014C32]/20 flex items-center gap-2"
        >
          <IconsaxIcon name="add" size={16} color="white" />
          Top Up Wallet
        </button>
      </div>

      {/* Balance Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Balance Card */}
        <div className="md:col-span-1 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#014C32] via-[#079B48] to-[#087F3C] p-7 text-white shadow-xl shadow-[#079B48]/20">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -right-5 top-10 w-24 h-24 rounded-full bg-[#D5F28A]/10" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#D5F28A]">
                Available Balance
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <IconsaxIcon name="wallet" size={16} color="white" />
              </div>
            </div>

            <div className="text-[40px] font-extrabold font-['Outfit'] leading-none mb-1">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[12px] text-white/70">
              Hello, {displayName} · USD Wallet
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowTopUp(true)}
                className="flex-1 h-[38px] rounded-[20px] bg-white/15 hover:bg-white/25 text-white text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <IconsaxIcon name="add" size={14} color="white" />
                Top Up
              </button>
              <button
                onClick={() => showToast('Withdrawal request initiated! Bank transfer within 1–2 business days.', 'success')}
                className="flex-1 h-[38px] rounded-[20px] bg-white text-[#014C32] text-[13px] font-bold transition-colors hover:bg-[#EAF8D8] flex items-center justify-center gap-1.5"
              >
                <IconsaxIcon name="export" size={14} color="#014C32" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Total Earned */}
        <div className="smile-card p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">Total Earned</span>
            <div className="w-10 h-10 rounded-2xl bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center">
              <IconsaxIcon name="trend-up" size={20} color="#079B48" />
            </div>
          </div>
          <div className="text-[32px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            ${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[12px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-2">
            Escrow releases + bonuses
          </p>
        </div>

        {/* Total Withdrawn */}
        <div className="smile-card p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">Total Withdrawn</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF6E5] dark:bg-[#332210] flex items-center justify-center">
              <IconsaxIcon name="export" size={20} color="#F28C00" />
            </div>
          </div>
          <div className="text-[32px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            ${totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[12px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-2">
            Bank transfers + deductions
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
              Transaction History
            </h3>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
              Full ledger of credits, debits, and transfers
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#F5F6F5] dark:bg-[#202922] p-1 rounded-2xl border border-[#EEEEEE] dark:border-[#27332A]">
            {['all', 'credit', 'debit'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTxFilter(tab)}
                className={`px-4 py-1.5 rounded-xl text-[12px] font-bold capitalize transition-all ${
                  txFilter === tab ? 'bg-[#079B48] text-white shadow-sm' : 'text-[#777D79] dark:text-[#8E9A92] hover:text-[#171917] dark:hover:text-[#F0F5F2]'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'credit' ? '↑ Credits' : '↓ Debits'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] dark:border-[#27332A] text-[#777D79] dark:text-[#8E9A92]">
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">DESCRIPTION</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">DATE</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">REF</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">AMOUNT</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">BALANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]/70 dark:divide-[#27332A]/70">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F5F6F5]/60 dark:hover:bg-[#202922]/50 transition-colors">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'credit' ? 'bg-[#EAF8D8] dark:bg-[#14301C]' : 'bg-[#FDECEC] dark:bg-[#331414]'
                      }`}>
                        {tx.type === 'credit' ? (
                          <IconsaxIcon name="trend-up" size={16} color="#079B48" />
                        ) : (
                          <IconsaxIcon name="trend-down" size={16} color="#D95353" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#171917] dark:text-[#F0F5F2]">{tx.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 font-medium text-[#777D79] dark:text-[#8E9A92]">{tx.date}</td>
                  <td className="py-4 px-3">
                    <span className="font-mono text-[11px] px-2 py-1 rounded-lg bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] dark:text-[#8E9A92]">
                      {tx.ref}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className={`font-extrabold text-[14px] font-['Outfit'] ${
                      tx.type === 'credit' ? 'text-[#149B57]' : 'text-[#D95353]'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] text-[13px]">
                    ${tx.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTx.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F5F6F5] dark:bg-[#202922] flex items-center justify-center mx-auto mb-3">
              <IconsaxIcon name="wallet" size={22} color="#777D79" />
            </div>
            <p className="text-[14px] font-semibold text-[#777D79]">No {txFilter} transactions found.</p>
          </div>
        )}
      </div>

      {/* Top-Up Modal */}
      {showTopUp && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setShowTopUp(false)}
        >
          <div className="w-full max-w-[480px] bg-white dark:bg-[#181F1A] rounded-[32px] border border-[#EEEEEE] dark:border-[#27332A] shadow-2xl p-7 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                  Top Up Wallet
                </h3>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
                  Instant credit to your SMILE FOOD wallet
                </p>
              </div>
              <button
                onClick={() => setShowTopUp(false)}
                className="w-9 h-9 rounded-full bg-[#F5F6F5] dark:bg-[#202922] flex items-center justify-center hover:bg-[#EEEEEE] dark:hover:bg-[#27332A] transition-colors"
              >
                <IconsaxIcon name="failed" size={16} color="#777D79" />
              </button>
            </div>

            {/* Quick Amount Selector */}
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-3">Quick Select Amount</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {TOP_UP_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setTopUpAmount(amt.toString()); setCustomAmount(''); }}
                  className={`h-[44px] rounded-2xl text-[14px] font-bold transition-all ${
                    topUpAmount === amt.toString() && !customAmount
                      ? 'bg-[#014C32] text-white shadow-md'
                      : 'bg-[#F5F6F5] dark:bg-[#202922] text-[#171917] dark:text-[#F0F5F2] hover:bg-[#EAF8D8] dark:hover:bg-[#14301C] hover:text-[#079B48]'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-5">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-2">
                Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-bold text-[#777D79]">$</span>
                <input
                  type="number"
                  min="100"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setTopUpAmount(''); }}
                  placeholder="Enter amount (min. $100)"
                  className="w-full h-[52px] pl-8 pr-4 rounded-[12px] border border-[#EEEEEE] bg-[#F5F6F5] text-[14px] font-bold text-[#171917] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:bg-white focus:ring-2 focus:ring-[#079B48]/12 transition-all dark:bg-[#202922] dark:border-[#27332A] dark:text-[#F0F5F2]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-3">Payment Method</p>
            <div className="space-y-2 mb-6">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                    paymentMethod === method.id
                      ? 'border-[#079B48] bg-[#EAF8D8] dark:bg-[#14301C]'
                      : 'border-[#EEEEEE] dark:border-[#27332A] hover:border-[#D5F28A]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#202922] flex items-center justify-center shadow-xs">
                    <IconsaxIcon name={method.icon} size={18} color={paymentMethod === method.id ? '#079B48' : '#777D79'} />
                  </div>
                  <span className={`text-[14px] font-semibold ${paymentMethod === method.id ? 'text-[#014C32] dark:text-[#D5F28A]' : 'text-[#171917] dark:text-[#F0F5F2]'}`}>
                    {method.label}
                  </span>
                  {paymentMethod === method.id && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-[#079B48] flex items-center justify-center">
                      <IconsaxIcon name="check" size={11} color="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Summary & CTA */}
            {(topUpAmount || customAmount) && (
              <div className="p-4 rounded-2xl bg-[#EAF8D8] dark:bg-[#14301C] mb-4 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#014C32] dark:text-[#D5F28A]">You'll add to wallet:</span>
                <span className="text-[20px] font-extrabold text-[#014C32] dark:text-[#D5F28A] font-['Outfit']">
                  ${parseFloat(customAmount || topUpAmount || 0).toFixed(2)}
                </span>
              </div>
            )}

            <button
              onClick={handleTopUp}
              disabled={isProcessing || (!topUpAmount && !customAmount)}
              className="w-full h-[48px] rounded-[30px] bg-[#014C32] hover:bg-[#038B5C] text-white text-[15px] font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#014C32]/20"
            >
              {isProcessing ? (
                <>
                  <IconsaxIcon name="loading" size={18} color="white" />
                  Processing payment...
                </>
              ) : (
                `Pay Now${topUpAmount || customAmount ? ` — $${parseFloat(customAmount || topUpAmount).toFixed(2)}` : ''}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;

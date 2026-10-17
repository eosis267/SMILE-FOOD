import React, { useState } from 'react';
import IconsaxIcon from './IconsaxIcon';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { VALID_TRANSITIONS } from '../data/ledgerService';
import { maskPhoneNumber } from '../lib/apiSecurity';
import { downloadOrderReceipt } from '../lib/receiptGenerator';

export const OrderDetailModal = () => {
  const { 
    selectedOrder, 
    setSelectedOrder, 
    advanceOrderState, 
    showToast 
  } = useApp();
  const { user } = useAuth();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Customer changed delivery address');

  if (!selectedOrder) return null;

  const currentStep = selectedOrder.stateMachineStep;
  const validTransitions = VALID_TRANSITIONS[currentStep] || [];
  const nextStep = validTransitions.find(s => s !== 'Cancelled');

  const handleCopyOrderNumber = () => {
    navigator.clipboard?.writeText(selectedOrder.orderNumber);
    showToast(`Order ${selectedOrder.orderNumber} copied!`, 'info');
  };

  const handleAdvance = () => {
    if (nextStep) {
      advanceOrderState(selectedOrder.id, nextStep);
    }
  };

  const handleConfirmCancel = () => {
    advanceOrderState(selectedOrder.id, 'Cancelled', cancelReason);
    setCancelModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[36px] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#EEEEEE] dark:border-[#27332A]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[22px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                Order {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={handleCopyOrderNumber}
                title="Copy order number"
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[#777D79] transition-colors"
              >
                <IconsaxIcon name="copy" size={16} />
              </button>
              <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                selectedOrder.status === 'Completed' 
                  ? 'bg-[#EAF8D8] text-[#149B57] dark:bg-[#14301C] dark:text-[#D5F28A]'
                  : selectedOrder.status === 'Pending'
                  ? 'bg-[#FFF6E5] text-[#F28C00] dark:bg-[#332210] dark:text-[#F28C00]'
                  : 'bg-[#FDECEC] text-[#D95353] dark:bg-[#331414] dark:text-[#E56262]'
              }`}>
                {selectedOrder.status}
              </span>
            </div>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
              Placed on {selectedOrder.timestamp} • {selectedOrder.region}
            </p>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            aria-label="Close Order Details"
            className="w-9 h-9 rounded-full bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] hover:text-[#171917] dark:hover:text-[#F0F5F2] flex items-center justify-center text-sm transition-colors"
          >
            <IconsaxIcon name="close" size={16} />
          </button>
        </div>

        {/* State Machine Step Tracker */}
        <div className="my-6 p-4 rounded-[28px] bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
              Order State Machine Lifecycle
            </span>
            <span className="text-[12px] font-bold text-[#079B48]">
              Step: {selectedOrder.stateMachineStep}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center">
            {['Created', 'Accepted', 'Preparing', 'Ready', 'Dispatched', 'Delivered'].map((stepName, i) => {
              const fullStepNames = ['Created', 'Accepted', 'Preparing', 'Ready_For_Pickup', 'Dispatched', 'Delivered'];
              const currentIdx = fullStepNames.indexOf(selectedOrder.stateMachineStep);
              const isPastOrCurrent = currentIdx >= i && selectedOrder.stateMachineStep !== 'Cancelled';
              const isCurrent = fullStepNames[i] === selectedOrder.stateMachineStep;

              return (
                <div key={stepName} className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all mb-1 ${
                    selectedOrder.stateMachineStep === 'Cancelled'
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                      : isCurrent
                      ? 'bg-[#079B48] text-white ring-4 ring-[#EAF8D8] dark:ring-[#14301C]'
                      : isPastOrCurrent
                      ? 'bg-[#149B57] text-white'
                      : 'bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] text-[#777D79]'
                  }`}>
                    {isPastOrCurrent && !isCurrent ? (
                      <IconsaxIcon name="check" size={12} color="#FFFFFF" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold leading-tight ${
                    isCurrent ? 'text-[#079B48] font-bold' : 'text-[#777D79] dark:text-[#8E9A92]'
                  }`}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>

          {selectedOrder.stateMachineStep === 'Cancelled' && (
            <div className="mt-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2">
              <IconsaxIcon name="failed" size={16} color="#D95353" />
              <span className="text-[12px] font-semibold text-[#D95353]">
                Order Cancelled: {selectedOrder.cancelReason || 'Operational cancellation'} • Escrow fully reversed.
              </span>
            </div>
          )}
        </div>

        {/* Customer & Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-[24px] bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1">
              Customer Details
            </p>
            <p className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2]">
              {selectedOrder.customer.name}
            </p>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
              {maskPhoneNumber(selectedOrder.customer.phone)}
            </p>
            <p className="text-[12px] text-[#171917] dark:text-[#F0F5F2] mt-1 flex items-center gap-1.5">
              <IconsaxIcon name="location" size={14} className="text-[#079B48] shrink-0" />
              <span>{selectedOrder.customer.address}</span>
            </p>
          </div>

          <div className="p-4 rounded-[24px] bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1">
              Restaurant Vendor
            </p>
            <p className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2]">
              {selectedOrder.restaurant.name}
            </p>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] flex items-center gap-1.5">
              <IconsaxIcon name="location" size={14} className="text-[#079B48] shrink-0" />
              <span>{selectedOrder.restaurant.address}</span>
            </p>
            <p className="text-[12px] text-[#079B48] font-semibold mt-1">
              Payment: {selectedOrder.paymentMethod}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2">
            Items Ordered
          </p>
          <div className="divide-y divide-[#EEEEEE] dark:divide-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] rounded-[24px] p-3">
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="py-2.5 px-2 flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-white dark:bg-[#181F1A] flex items-center justify-center font-bold text-[12px] text-[#079B48]">
                    {item.qty}x
                  </span>
                  <span className="font-semibold text-[#171917] dark:text-[#F0F5F2]">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">
                  ₦{(item.qty * item.price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Way Escrow Split Breakdown */}
        <div className="p-5 rounded-[28px] bg-gradient-to-br from-[#EAF8D8]/50 to-[#D5F28A]/20 dark:from-[#14301C] dark:to-[#181F1A] border border-[#079B48]/20 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconsaxIcon name="wallet" size={18} color="#079B48" />
              <span className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                Escrow Split Ledger Distribution
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              selectedOrder.escrowStatus === 'RELEASED'
                ? 'bg-[#149B57] text-white'
                : selectedOrder.escrowStatus === 'LOCKED'
                ? 'bg-[#F28C00] text-white'
                : 'bg-[#D95353] text-white'
            }`}>
              ESCROW: {selectedOrder.escrowStatus}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] block">
                Vendor (85%)
              </span>
              <span className="text-[16px] font-extrabold text-[#079B48] block mt-1 font-['Outfit']">
                ₦{selectedOrder.split.vendor.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] block">
                Rider Delivery
              </span>
              <span className="text-[16px] font-extrabold text-[#087F3C] block mt-1 font-['Outfit']">
                ₦{selectedOrder.split.rider.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] block">
                Platform Margin
              </span>
              <span className="text-[16px] font-extrabold text-[#F28C00] block mt-1 font-['Outfit']">
                ₦{selectedOrder.split.platform.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#079B48]/15 text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">
            <span>Total Customer Settlement:</span>
            <span className="text-[18px] text-[#079B48] font-['Outfit']">
              ₦{selectedOrder.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-2 w-full sm:w-auto">
            {validTransitions.includes('Cancelled') && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-red-200 dark:border-red-900/40 text-[#D95353] hover:bg-red-50 dark:hover:bg-red-950/20 text-[13px] font-bold transition-all"
              >
                Cancel & Refund
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                downloadOrderReceipt(selectedOrder, user);
                showToast(`Downloaded receipt for ${selectedOrder.orderNumber}!`, 'success');
              }}
              className="px-4 py-2.5 rounded-full border border-[#079B48]/30 bg-[#EAF8D8] dark:bg-[#14301C] text-[#079B48] dark:text-[#D5F28A] text-[13px] font-bold hover:bg-[#D5F28A] dark:hover:bg-[#1d4427] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <IconsaxIcon name="receipt" size={15} color="#079B48" />
              <span>Download Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="px-5 py-2.5 rounded-full border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#777D79] hover:bg-[#F5F6F5] dark:hover:bg-[#202922]"
            >
              Close
            </button>

            {nextStep && (
              <button
                type="button"
                onClick={handleAdvance}
                className="px-6 py-2.5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/25 flex items-center gap-1.5"
              >
                <span>Advance to {nextStep}</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-modal: Confirm Cancellation Reason */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-[18px] font-bold text-[#D95353] font-['Outfit'] mb-2">
                Confirm Order Cancellation & Refund
              </h3>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mb-4">
                This will reverse the escrow holding liability and trigger a customer refund ledger transaction. Please select a reason:
              </p>
              
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] mb-5 focus:outline-none"
              >
                <option value="Customer requested cancellation">Customer requested cancellation</option>
                <option value="Restaurant kitchen out of ingredients">Restaurant kitchen out of ingredients</option>
                <option value="Courier vehicle breakdown">Courier vehicle breakdown</option>
                <option value="Unreachable delivery address">Unreachable delivery address</option>
                <option value="Fraudulent card / Chargeback defense">Fraudulent card / Chargeback defense</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 rounded-full border text-[13px] font-semibold text-[#777D79]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-5 py-2 rounded-full bg-[#D95353] text-white text-[13px] font-bold hover:bg-red-700 shadow-md shadow-red-500/20"
                >
                  Confirm Refund
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderDetailModal;

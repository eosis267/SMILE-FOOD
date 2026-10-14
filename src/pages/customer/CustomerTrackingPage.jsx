import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';

const STATUS_STEPS = [
  { key: 'Created', label: 'Order Created', desc: 'Order submitted to kitchen' },
  { key: 'Pending', label: 'Payment Escrow Locked', desc: 'ACID escrow held securely' },
  { key: 'Accepted', label: 'Kitchen Accepted', desc: 'Restaurant confirmed prep' },
  { key: 'Preparing', label: 'Food Preparing', desc: 'Fresh cooking in progress' },
  { key: 'Dispatched', label: 'Courier On Route', desc: 'Rider picked up package' },
  { key: 'Delivered', label: 'Delivered & Settled', desc: 'Escrow released to vendor & rider' }
];

export const CustomerTrackingPage = () => {
  const { orders, showToast } = useApp();
  const [currentStepIdx, setCurrentStepIdx] = useState(3); // Default at 'Preparing'

  const activeOrder = orders[0] || {
    orderNumber: '#SF-84201',
    customer: { name: 'Adeola Williams', address: '14 Adeola Odeku St, VI, Lagos' },
    restaurant: { name: 'Mama Cass Restaurant' },
    totalAmount: 49.00,
    items: [{ name: 'Special Smokey Party Jollof', quantity: 2 }]
  };

  const advanceStep = () => {
    if (currentStepIdx < STATUS_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      showToast(`Order status updated: ${STATUS_STEPS[nextIdx].label}!`, 'success');
    }
  };

  const cancelActiveOrder = () => {
    if (currentStepIdx >= 4) {
      showToast('Cannot cancel order after dispatch. Please contact live customer support.', 'error');
      return;
    }
    showToast('Order cancelled. Escrow refund returned to your wallet.', 'info');
    setCurrentStepIdx(0);
  };

  const currentStep = STATUS_STEPS[currentStepIdx];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/customer" label="Explore Dishes" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Live Order Tracking
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            Active order {activeOrder.orderNumber} from {activeOrder.restaurant?.name}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={advanceStep}
            disabled={currentStepIdx === STATUS_STEPS.length - 1}
            className="px-4 py-2 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold shadow-sm transition-all disabled:opacity-40"
          >
            Advance Step →
          </button>
          {currentStepIdx < 4 && (
            <button
              onClick={cancelActiveOrder}
              className="px-4 py-2 rounded-full bg-[#FDECEC] text-[#D95353] text-[12px] font-bold hover:bg-[#FCD8D8]"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Hero Delivery Status Card */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE] dark:border-[#27332A]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#079B48] dark:text-[#D5F28A] block mb-1">
              Estimated Delivery
            </span>
            <div className="text-[28px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
              {currentStepIdx === 5 ? 'Arrived!' : '18 – 25 mins'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center">
            <IconsaxIcon name={currentStepIdx >= 4 ? "scooter" : "shop"} size={26} color="#079B48" />
          </div>
        </div>

        {/* Multi-step Progression Machine Stepper */}
        <div className="space-y-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
            Lifecycle Progression
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#EAF8D8] dark:bg-[#14301C] border-[#079B48] text-[#079B48]'
                      : isPast
                      ? 'bg-white dark:bg-[#181F1A] border-[#D5F28A] text-[#079B48]'
                      : 'bg-[#F5F6F5] dark:bg-[#202922] border-transparent text-[#777D79] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold font-mono">0{idx + 1}</span>
                    {isPast && <IconsaxIcon name="check" size={12} color="#079B48" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-[#079B48] animate-ping" />}
                  </div>
                  <p className="font-bold text-[12px] leading-tight mb-0.5">{step.label}</p>
                  <p className="text-[10px] leading-tight opacity-80">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courier & Route Map Preview Card */}
        <div className="p-4 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#079B48] text-white flex items-center justify-center font-bold">
              TB
            </div>
            <div>
              <p className="font-bold text-[14px] text-[#171917] dark:text-[#F0F5F2]">Tunde Bakare</p>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">Fleet Rider · Bajaj Pulsar (LAG-482-XA)</p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#F28C00] font-bold mt-0.5">
                <span className="flex items-center gap-1">
                  <IconsaxIcon name="star" size={13} color="#F28C00" />
                  <span>4.9 Rating</span>
                </span>
                <span>· 420+ Deliveries</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => showToast('Calling courier rider (+234 802 334 5566)...', 'info')}
            className="px-4 py-2.5 rounded-full bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] hover:border-[#079B48] transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <IconsaxIcon name="mobile" size={15} color="#079B48" />
            <span>Call Driver</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTrackingPage;

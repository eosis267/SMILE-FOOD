import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const ACTIVE_DELIVERY = {
  orderId: '#SF-88291',
  customer: 'Adeola Williams',
  address: '14 Adeyemo Alakija St, Victoria Island',
  restaurant: 'Mama Cass Restaurant',
  items: ['Special Smokey Party Jollof x1', 'Fried Plantain x1'],
  totalAmount: 21.50,
  distance: '3.2 km',
  eta: '8 mins',
  tip: 1.50,
};

const TODAYS_STATS = [
  { label: 'Deliveries Done', value: '12', icon: 'check-circle', color: '#079B48', bg: '#EAF8D8' },
  { label: "Today's Earnings", value: '₦8,420', icon: 'wallet', color: '#087F3C', bg: '#D5F8E0' },
  { label: 'Avg. Rating', value: '4.9 / 5.0', icon: 'star', color: '#F28C00', bg: '#FEF5E7' },
  { label: 'Active Hours', value: '6h 42m', icon: 'clock', color: '#079B48', bg: '#EAF8D8' },
];

const RECENT_DELIVERIES = [
  { id: '#SF-88290', customer: 'Chukwuma Eze', address: 'Wuse II, Abuja', amount: 18.00, tip: 2.00, time: '11:45 AM', rating: 5 },
  { id: '#SF-88287', customer: 'Kemi Adeyemi', address: 'Lekki Phase 1', amount: 24.50, tip: 1.50, time: '10:20 AM', rating: 5 },
  { id: '#SF-88283', customer: 'Ola Benson', address: 'Surulere, Lagos', amount: 15.00, tip: 0, time: '09:05 AM', rating: 4 },
  { id: '#SF-88279', customer: 'Ada Okonkwo', address: 'Ikeja GRA', amount: 32.00, tip: 3.00, time: '08:15 AM', rating: 5 },
];

export const RiderDashboard = () => {
  const { showToast } = useApp();
  const { displayName } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [deliveryStep, setDeliveryStep] = useState(1); // 1=picked up, 2=en route, 3=delivered

  const handleToggleOnline = () => {
    setIsOnline(prev => {
      showToast(prev ? 'You are now offline — no new orders' : 'You are back online and accepting orders!', prev ? 'warning' : 'success');
      return !prev;
    });
  };

  const handleNextStep = () => {
    if (deliveryStep < 3) {
      const msgs = ['', 'Order picked up from restaurant!', 'En route to customer. ETA updated.', 'Delivery confirmed! Earnings credited.'];
      setDeliveryStep(prev => {
        showToast(msgs[prev + 1] || 'Delivery complete!', 'success');
        return prev + 1;
      });
    }
  };

  const stepLabels = ['Awaiting Pickup', 'Picked Up', 'En Route', 'Delivered'];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
            Rider Hub
          </h1>
          <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
            Welcome back, {displayName.split(' ')[0]}. Let's get rolling!
          </p>
        </div>

        {/* Online / Offline toggle */}
        <button
          onClick={handleToggleOnline}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[14px] font-bold transition-all shadow-sm active:scale-95 ${
            isOnline
              ? 'bg-[#079B48] text-white shadow-[#079B48]/25'
              : 'bg-[#EEE] text-[#777D79] dark:bg-[#202922] dark:text-[#8E9A92]'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#D5F28A] animate-pulse' : 'bg-[#AAAAAA]'}`} />
          {isOnline ? 'Online — Accepting Orders' : 'Offline'}
        </button>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {TODAYS_STATS.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#181F1A] rounded-[20px] border border-[#EEEEEE] dark:border-[#27332A] p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
              <IconsaxIcon name={stat.icon} size={20} color={stat.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#777D79] dark:text-[#8E9A92] truncate">{stat.label}</p>
              <p className="text-[18px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Delivery Card */}
      {isOnline && (
        <div className="bg-gradient-to-br from-[#079B48] to-[#038B5C] rounded-[24px] p-6 text-white shadow-xl shadow-[#079B48]/20 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-36 h-36 rounded-full bg-[#D5F28A]/10 blur-xl pointer-events-none" />

          <div className="flex items-start justify-between mb-5 relative">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D5F28A] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D5F28A] animate-pulse" />
                Active Delivery
              </span>
              <h2 className="text-[20px] font-extrabold font-['Outfit']">{ACTIVE_DELIVERY.orderId}</h2>
              <p className="text-[13px] text-white/80 mt-0.5">{ACTIVE_DELIVERY.restaurant} → {ACTIVE_DELIVERY.customer}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-white/70 mb-0.5">ETA</p>
              <p className="text-[22px] font-extrabold font-['Outfit']">{ACTIVE_DELIVERY.eta}</p>
              <p className="text-[11px] text-white/70">{ACTIVE_DELIVERY.distance} away</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative flex items-center justify-between mb-5">
            {[1, 2, 3].map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    deliveryStep >= step
                      ? 'bg-white border-white shadow-lg'
                      : 'bg-transparent border-white/40'
                  }`}>
                    {deliveryStep > step
                      ? <IconsaxIcon name="check" size={14} color="#079B48" />
                      : <span className={`text-[12px] font-bold ${deliveryStep === step ? 'text-[#079B48]' : 'text-white/60'}`}>{step}</span>
                    }
                  </div>
                  <span className="text-[10px] font-semibold text-white/80 text-center w-16">{stepLabels[step]}</span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all ${deliveryStep > step ? 'bg-white' : 'bg-white/25'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Delivery Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <IconsaxIcon name="orders" size={14} color="#D5F28A" />
              <span className="text-[12px] text-white/90">{ACTIVE_DELIVERY.items.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconsaxIcon name="scooter" size={14} color="#D5F28A" />
              <span className="text-[12px] text-white/90">{ACTIVE_DELIVERY.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconsaxIcon name="wallet" size={14} color="#D5F28A" />
              <span className="text-[12px] text-white/90">₦{(ACTIVE_DELIVERY.totalAmount * 100).toFixed(0).slice(0, 4)}  +  Tip: ₦{(ACTIVE_DELIVERY.tip * 100).toFixed(0)}</span>
            </div>
          </div>

          {deliveryStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="w-full py-3 rounded-[14px] bg-white text-[#079B48] text-[14px] font-extrabold hover:bg-[#EAF8D8] transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
            >
              <IconsaxIcon name="arrow-right" size={18} color="#079B48" />
              {deliveryStep === 1 ? 'Confirm Pickup' : 'Mark as Delivered'}
            </button>
          ) : (
            <div className="w-full py-3 rounded-[14px] bg-white/20 text-white text-[14px] font-bold text-center flex items-center justify-center gap-2">
              <IconsaxIcon name="check" size={16} color="white" />
              <span>Delivery Completed! Earnings Credited.</span>
            </div>
          )}
        </div>
      )}

      {!isOnline && (
        <div className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F5F6F5] dark:bg-[#202922] flex items-center justify-center mx-auto mb-3">
            <IconsaxIcon name="scooter" size={28} color="#AAAAAA" />
          </div>
          <p className="text-[15px] font-bold text-[#777D79]">You're offline</p>
          <p className="text-[13px] text-[#AAAAAA] mt-1">Go online to start receiving delivery orders</p>
        </div>
      )}

      {/* Recent Deliveries */}
      <div>
        <h2 className="text-[17px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-4">Today's Completed Deliveries</h2>
        <div className="space-y-3">
          {RECENT_DELIVERIES.map((delivery) => (
            <div key={delivery.id} className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[18px] p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center shrink-0">
                <IconsaxIcon name="check-circle" size={20} color="#079B48" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2] truncate">{delivery.customer}</p>
                  <span className="text-[11px] font-bold text-[#AAAAAA] font-mono">{delivery.id}</span>
                </div>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] truncate">{delivery.address}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-extrabold text-[#079B48]">+₦{(delivery.amount * 100).toFixed(0).slice(0, 4)}</p>
                {delivery.tip > 0 && <p className="text-[11px] text-[#F28C00] font-semibold">+₦{(delivery.tip * 100).toFixed(0)} tip</p>}
                <p className="text-[11px] text-[#AAAAAA]">{delivery.time}</p>
              </div>
              <div className="flex shrink-0 gap-0.5">
                {Array.from({ length: delivery.rating }).map((_, i) => (
                  <IconsaxIcon key={i} name="star" size={11} color="#F28C00" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;

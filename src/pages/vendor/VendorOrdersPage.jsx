import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';

const VENDOR_ORDERS = [
  { id: '#SF-88291', customer: 'Adeola Williams', items: ['Party Jollof x1', 'Fried Dodo x1'], amount: 21500, status: 'Preparing', time: '2026-10-13 13:42', paymentRef: 'tx_live_88291' },
  { id: '#SF-88290', customer: 'Chukwuma Eze', items: ['Grilled Catfish x1'], amount: 24000, status: 'Ready', time: '2026-10-13 13:30', paymentRef: 'tx_live_88290' },
  { id: '#SF-88289', customer: 'Kemi Adeyemi', items: ['Classic Fried Rice x2'], amount: 27000, status: 'Delivered', time: '2026-10-13 12:18', paymentRef: 'tx_live_88289' },
  { id: '#SF-88285', customer: 'Ola Benson', items: ['Egusi + Pounded Yam x1'], amount: 18000, status: 'Delivered', time: '2026-10-13 11:05', paymentRef: 'tx_live_88285' },
  { id: '#SF-88280', customer: 'Temi Olaosebikan', items: ['Suya Skewers x3', 'Zobo Drink x2'], amount: 36000, status: 'Delivered', time: '2026-10-13 10:33', paymentRef: 'tx_live_88280' },
  { id: '#SF-88271', customer: 'Emeka Nwachukwu', items: ['Party Jollof x2'], amount: 29000, status: 'Delivered', time: '2026-10-13 09:47', paymentRef: 'tx_live_88271' },
  { id: '#SF-88252', customer: 'Ngozi Okonkwo', items: ['Catfish Pepper Soup x1'], amount: 22000, status: 'Cancelled', time: '2026-10-12 21:10', paymentRef: 'tx_live_88252', cancelReason: 'Customer cancelled' },
];

const STATUS_CONFIG = {
  Preparing: { bg: '#FEF5E7', text: '#F28C00', icon: 'clock' },
  Ready: { bg: '#EAF8D8', text: '#087F3C', icon: 'check-circle' },
  Delivered: { bg: '#EAF8D8', text: '#079B48', icon: 'check-circle' },
  Cancelled: { bg: '#FDECEC', text: '#D95353', icon: 'close-circle' },
};

export const VendorOrdersPage = () => {
  const { showToast } = useApp();
  const [orders, setOrders] = useState(VENDOR_ORDERS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = orders.filter(o => statusFilter === 'All' || o.status === statusFilter);

  const counts = {
    All: orders.length,
    Preparing: orders.filter(o => o.status === 'Preparing').length,
    Ready: orders.filter(o => o.status === 'Ready').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  const markReady = (id) => {
    setOrders(prev => prev.map(o => o.id === id && o.status === 'Preparing' ? { ...o, status: 'Ready' } : o));
    showToast(`${id} is ready for rider pickup!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/vendor" label="Kitchen Dashboard" />
        </div>
        <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
          Kitchen Orders
        </h1>
        <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
          Manage incoming and outgoing food orders from your restaurant.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap p-1 bg-[#F5F6F5] dark:bg-[#181F1A] rounded-[16px] border border-[#EEEEEE] dark:border-[#27332A]">
        {['All', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-2 rounded-[12px] text-[12px] font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === status
                ? 'bg-[#079B48] text-white shadow-sm'
                : 'text-[#777D79] dark:text-[#8E9A92] hover:bg-white dark:hover:bg-[#202922]'
            }`}
          >
            {status}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              statusFilter === status ? 'bg-white/25 text-white' : 'bg-[#EEEEEE] dark:bg-[#27332A] text-[#777D79]'
            }`}>
              {counts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Delivered;
          const isExpanded = expanded === order.id;
          return (
            <div key={order.id} className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[20px] overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                className="w-full p-5 flex items-center gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                  <IconsaxIcon name={cfg.icon} size={20} color={cfg.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2]">{order.customer}</p>
                    <span className="text-[11px] text-[#AAAAAA] font-mono">{order.id}</span>
                  </div>
                  <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] truncate">{order.items.join(', ')}</p>
                  <p className="text-[11px] text-[#AAAAAA] mt-0.5">{order.time.replace('T', ' ')}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[15px] font-extrabold text-[#171917] dark:text-[#F0F5F2]">₦{order.amount.toLocaleString()}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.text }}>
                    {order.status}
                  </span>
                </div>
                <IconsaxIcon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color="#AAAAAA" />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-[#EEEEEE] dark:border-[#27332A]">
                  <div className="pt-4 space-y-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAAA] mb-1.5">Items Ordered</p>
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#079B48] shrink-0" />
                            <span className="text-[13px] text-[#171917] dark:text-[#F0F5F2]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <div>
                        <span className="text-[#777D79] dark:text-[#8E9A92]">Payment Ref: </span>
                        <span className="font-mono font-bold text-[#171917] dark:text-[#F0F5F2]">{order.paymentRef}</span>
                      </div>
                      {order.cancelReason && (
                        <span className="text-[#D95353] font-semibold">{order.cancelReason}</span>
                      )}
                    </div>
                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => markReady(order.id)}
                        className="w-full py-2.5 rounded-[12px] bg-[#079B48] text-white text-[13px] font-bold hover:bg-[#087F3C] transition-colors mt-1"
                      >
                        Mark as Ready for Pickup
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VendorOrdersPage;

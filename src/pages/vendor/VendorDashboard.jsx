import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';

const VENDOR_STATS = [
  { label: "Today's Revenue", value: '₦47,200', sub: '+12% vs yesterday', icon: 'trend-up', color: '#079B48', bg: '#EAF8D8' },
  { label: 'Orders Today', value: '34', sub: '6 pending', icon: 'orders', color: '#087F3C', bg: '#D5F8E0' },
  { label: 'Avg. Order Value', value: '₦13,882', sub: 'Per order', icon: 'wallet', color: '#F28C00', bg: '#FEF5E7' },
  { label: 'Menu Items', value: '24', sub: '2 out of stock', icon: 'shop', color: '#079B48', bg: '#EAF8D8' },
];

const RECENT_VENDOR_ORDERS = [
  { id: '#SF-88291', customer: 'Adeola Williams', items: 'Party Jollof x1, Dodo x1', amount: 21500, status: 'Preparing', time: '2 mins ago' },
  { id: '#SF-88290', customer: 'Chukwuma Eze', items: 'Grilled Catfish x1', amount: 24000, status: 'Ready', time: '8 mins ago' },
  { id: '#SF-88289', customer: 'Kemi Adeyemi', items: 'Fried Rice x2', amount: 27000, status: 'Delivered', time: '22 mins ago' },
  { id: '#SF-88285', customer: 'Ola Benson', items: 'Egusi + Pounded Yam x1', amount: 18000, status: 'Delivered', time: '1hr ago' },
  { id: '#SF-88280', customer: 'Temi Olaos', items: 'Suya Special x3', amount: 36000, status: 'Delivered', time: '2hrs ago' },
];

const TOP_DISHES = [
  { name: 'Special Smokey Party Jollof', orders: 184, revenue: 2668000 },
  { name: 'Classic Lagos Fried Rice', orders: 97, revenue: 1309500 },
  { name: 'Charcoal Grilled Jumbo Catfish', orders: 62, revenue: 1488000 },
  { name: 'Egusi Soup with Goat Meat', orders: 45, revenue: 810000 },
];

const statusConfig = {
  Preparing: { bg: '#FEF5E7', text: '#F28C00', label: 'Preparing' },
  Ready: { bg: '#EAF8D8', text: '#087F3C', label: 'Ready for Pickup' },
  Delivered: { bg: '#EAF8D8', text: '#079B48', label: 'Delivered' },
};

export const VendorDashboard = () => {
  const { showToast } = useApp();
  const [orders, setOrders] = useState(RECENT_VENDOR_ORDERS);

  const markReady = (id) => {
    setOrders(prev => prev.map(o => o.id === id && o.status === 'Preparing' ? { ...o, status: 'Ready' } : o));
    showToast(`Order ${id} marked ready for pickup!`, 'success');
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
            Kitchen Dashboard
          </h1>
          <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
            Mama Cass Restaurant — Live operations overview
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] border border-[#079B48]/20 text-[#079B48] text-[12px] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#079B48] animate-pulse" />
          Restaurant Open
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {VENDOR_STATS.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[20px] p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
              <IconsaxIcon name={stat.icon} size={20} color={stat.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#777D79] dark:text-[#8E9A92] truncate">{stat.label}</p>
              <p className="text-[17px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] leading-tight">{stat.value}</p>
              <p className="text-[10px] text-[#079B48] font-semibold">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Live Orders */}
        <div className="lg:col-span-3 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">Live Order Queue</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#079B48] animate-pulse" />
              <span className="text-[12px] font-bold text-[#079B48]">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            {orders.map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.Delivered;
              return (
                <div key={order.id} className="rounded-[16px] border border-[#EEEEEE] dark:border-[#27332A] p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">{order.customer}</p>
                      <span className="text-[11px] text-[#AAAAAA] font-mono">{order.id}</span>
                    </div>
                    <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] truncate">{order.items}</p>
                    <p className="text-[11px] text-[#AAAAAA] mt-0.5">{order.time}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                      ₦{order.amount.toLocaleString()}
                    </span>
                    {order.status === 'Preparing' ? (
                      <button
                        onClick={() => markReady(order.id)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#079B48] text-white hover:bg-[#087F3C] transition-colors"
                      >
                        Mark Ready
                      </button>
                    ) : (
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ background: cfg.bg, color: cfg.text }}
                      >
                        {cfg.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Dishes */}
        <div className="lg:col-span-2 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[24px] p-6">
          <h2 className="text-[16px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-5">Top Dishes</h2>
          <div className="space-y-4">
            {TOP_DISHES.map((dish, idx) => (
              <div key={dish.name} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center text-[11px] font-extrabold text-[#079B48] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] leading-tight truncate">{dish.name}</p>
                  <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92]">{dish.orders} orders · ₦{(dish.revenue / 1000).toFixed(0)}k revenue</p>
                  <div className="mt-1.5 h-1.5 bg-[#F5F6F5] dark:bg-[#202922] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#079B48] to-[#D5F28A]"
                      style={{ width: `${(dish.orders / TOP_DISHES[0].orders) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
            <p className="text-[12px] font-semibold text-[#777D79] dark:text-[#8E9A92] mb-1">Total October Revenue</p>
            <p className="text-[22px] font-black text-[#079B48] font-['Outfit']">₦6,275,500</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

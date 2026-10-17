import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import IconsaxIcon from '../components/IconsaxIcon';
import Toolbar from '../components/Toolbar';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { downloadOrderReceipt } from '../lib/receiptGenerator';

export const Overview = () => {
  const { 
    kpis, 
    regionalStats, 
    orders, 
    searchQuery, 
    filters, 
    setSelectedOrder, 
    showToast 
  } = useApp();
  const { user } = useAuth();

  const [activeMenuOrder, setActiveMenuOrder] = useState(null);

  // Filter orders according to search query, status filters, region, and amount bounds
  const filteredOrders = orders.filter(order => {
    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchCust = order.customer.name.toLowerCase().includes(q);
      const matchRest = order.restaurant.name.toLowerCase().includes(q);
      const matchItem = order.items.some(i => i.name.toLowerCase().includes(q));
      if (!matchNum && !matchCust && !matchRest && !matchItem) return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(order.status)) {
      return false;
    }

    // Region filter
    if (filters.region !== 'all' && order.region !== filters.region) {
      return false;
    }

    // Amount bounds
    if (order.totalAmount < filters.minAmount || order.totalAmount > filters.maxAmount) {
      return false;
    }

    return true;
  });

  const handleCopyOrderNumber = (ordNum) => {
    navigator.clipboard?.writeText(ordNum);
    showToast(`Copied ${ordNum} to clipboard!`, 'info');
    setActiveMenuOrder(null);
  };

  const handleDownloadReceipt = (order) => {
    downloadOrderReceipt(order, user);
    showToast(`Downloaded digital receipt for ${order.orderNumber}!`, 'success');
    setActiveMenuOrder(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <Toolbar />

      {/* 5.A. KPI Summary Cards (Horizontal Row of 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Monthly Delivery (857 orders, Red downward trend, delivery package icon with light-green accent) */}
        <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
              Monthly Delivery
            </span>
            {/* Delivery package icon with light-green accent */}
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center text-[#079B48] shadow-sm group-hover:scale-110 transition-transform">
              <IconsaxIcon name="package" size={24} color="#079B48" />
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-[34px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
              {kpis.monthlyDelivery.value}
            </h3>
            {/* Red downward trend indicator */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDECEC] dark:bg-[#331414] text-[#D95353]">
              <IconsaxIcon name="trend-down" size={14} color="#D95353" />
              <span className="text-[12px] font-bold font-['Outfit']">
                {kpis.monthlyDelivery.trend}
              </span>
            </div>
          </div>

          <p className="text-[12px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-2">
            {kpis.monthlyDelivery.subtitle} • 98.4% fulfillment rate
          </p>
        </div>

        {/* Card 2: Monthly Work Hours (158 hours, Green upward trend, clock icon with orange accent) */}
        <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
              Monthly Work Hours
            </span>
            {/* Clock icon with orange accent */}
            <div className="w-12 h-12 rounded-2xl bg-[#FFF6E5] dark:bg-[#332210] flex items-center justify-center text-[#F28C00] shadow-sm group-hover:scale-110 transition-transform">
              <IconsaxIcon name="clock" size={24} color="#F28C00" />
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-[34px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
              {kpis.monthlyWorkHours.value}
            </h3>
            {/* Green upward trend indicator */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] text-[#149B57]">
              <IconsaxIcon name="trend-up" size={14} color="#149B57" />
              <span className="text-[12px] font-bold font-['Outfit']">
                {kpis.monthlyWorkHours.trend}
              </span>
            </div>
          </div>

          <p className="text-[12px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-2">
            {kpis.monthlyWorkHours.subtitle} • 32 active couriers
          </p>
        </div>

        {/* Card 3: Earned Funds ($1.5k, Green upward trend, wallet/money icon with light-green accent) */}
        <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
              Earned Funds
            </span>
            {/* Wallet/money icon with light-green accent */}
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center text-[#079B48] shadow-sm group-hover:scale-110 transition-transform">
              <IconsaxIcon name="wallet" size={24} color="#079B48" />
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-[34px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
              {kpis.earnedFunds.value}
            </h3>
            {/* Green upward trend indicator */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] text-[#149B57]">
              <IconsaxIcon name="trend-up" size={14} color="#149B57" />
              <span className="text-[12px] font-bold font-['Outfit']">
                {kpis.earnedFunds.trend}
              </span>
            </div>
          </div>

          <p className="text-[12px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-2">
            {kpis.earnedFunds.subtitle} • Escrow settlement verified
          </p>
        </div>
      </div>

      {/* 5.B. Two-Column Lower Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-7 items-start">
        
        {/* Left Column (~30% width: 3 of 10) - Statistics Card */}
        <div className="lg:col-span-3 smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
              Regional Delivery
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]">
              Live
            </span>
          </div>
          <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mb-5">
            Distribution by geographic cluster
          </p>

          {/* Recharts Doughnut Chart with total orders (857) cleanly displayed in center */}
          <div className="relative w-full h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val, name) => [`${val}% of orders`, name]}
                  contentStyle={{
                    backgroundColor: '#181F1A',
                    borderColor: '#27332A',
                    borderRadius: '16px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                />
                <Pie
                  data={regionalStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={92}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {regionalStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Total Orders Clean Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] leading-none">
                857
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mt-1">
                Total Orders
              </span>
            </div>
          </div>

          {/* Regional Legend (Central: 52% Green, South-Western: 15% Pale lime, Eastern: 33% Orange) */}
          <div className="mt-6 space-y-3 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
            {regionalStats.map((reg) => (
              <div key={reg.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: reg.color }} 
                  />
                  <span className="font-semibold text-[#171917] dark:text-[#F0F5F2]">
                    {reg.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                    {reg.orders} ord
                  </span>
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                    {reg.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Dispatch SLA pill */}
          <div className="mt-5 p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] flex items-center justify-between text-[11px] font-semibold text-[#777D79] dark:text-[#8E9A92]">
            <span>Avg. Delivery SLA:</span>
            <span className="text-[#079B48] font-bold">24.2 mins</span>
          </div>
        </div>

        {/* Right Column (~70% width: 7 of 10) - Orders History Card */}
        <div className="lg:col-span-7 smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                Orders History
              </h3>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
                Multi-step status machine, ledger settlement, and actions
              </p>
            </div>
            <span className="text-[12px] font-semibold text-[#777D79] dark:text-[#8E9A92]">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          {/* Responsive Orders History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#EEEEEE] dark:border-[#27332A] text-[#777D79] dark:text-[#8E9A92]">
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">ORDER</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">STATUS</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">DATE & TIME</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">AMOUNT</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE]/70 dark:divide-[#27332A]/70">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#777D79]">
                      No orders match the current filter or search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isMenuOpen = activeMenuOrder === order.id;

                    return (
                      <tr 
                        key={order.id} 
                        className="hover:bg-[#F5F6F5]/60 dark:hover:bg-[#202922]/50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        {/* Order Number & Restaurant */}
                        <td className="py-4 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] group-hover:text-[#079B48] transition-colors">
                              {order.orderNumber}
                            </span>
                            <span className="text-[11px] text-[#777D79] dark:text-[#8E9A92] line-clamp-1">
                              {order.restaurant.name}
                            </span>
                          </div>
                        </td>

                        {/* Status (Completed, Pending, Failed with appropriate color-coded Iconsax icons) */}
                        <td className="py-4 px-3">
                          {order.status === 'Completed' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#EAF8D8] text-[#149B57] dark:bg-[#14301C] dark:text-[#D5F28A]">
                              <IconsaxIcon name="completed" size={14} color="#149B57" />
                              <span>Completed</span>
                            </span>
                          )}

                          {order.status === 'Pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#FFF6E5] text-[#F28C00] dark:bg-[#332210] dark:text-[#F28C00]">
                              <IconsaxIcon name="pending" size={14} color="#F28C00" />
                              <span>Pending</span>
                            </span>
                          )}

                          {order.status === 'Failed' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#FDECEC] text-[#D95353] dark:bg-[#331414] dark:text-[#E56262]">
                              <IconsaxIcon name="failed" size={14} color="#D95353" />
                              <span>Failed</span>
                            </span>
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="py-4 px-3 font-medium text-[#777D79] dark:text-[#8E9A92]">
                          {order.timestamp}
                        </td>

                        {/* Formatted Amount */}
                        <td className="py-4 px-3 font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] text-[14px]">
                          ₦{order.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Row-Level Action Menu (View Details, Copy Order Number, Download Receipt) */}
                        <td 
                          className="py-4 px-3 text-right relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => setActiveMenuOrder(isMenuOpen ? null : order.id)}
                              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-[#777D79] hover:text-[#171917] dark:hover:text-white transition-colors"
                              aria-label="Row actions"
                            >
                              <IconsaxIcon name="more" size={18} />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-9 w-48 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-2xl shadow-xl py-1.5 z-30 animate-in fade-in duration-100 text-left">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setActiveMenuOrder(null);
                                  }}
                                  className="w-full px-4 py-2 text-[12px] font-semibold text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] flex items-center gap-2"
                                >
                                  <IconsaxIcon name="clipboard" size={14} color="#079B48" />
                                  <span>View Details</span>
                                </button>
                                
                                <button
                                  onClick={() => handleCopyOrderNumber(order.orderNumber)}
                                  className="w-full px-4 py-2 text-[12px] font-semibold text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] flex items-center gap-2"
                                >
                                  <IconsaxIcon name="copy" size={14} color="#777D79" />
                                  <span>Copy Order Number</span>
                                </button>

                                <button
                                  onClick={() => handleDownloadReceipt(order)}
                                  className="w-full px-4 py-2 text-[12px] font-semibold text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] flex items-center gap-2"
                                >
                                  <IconsaxIcon name="pdf" size={14} color="#079B48" />
                                  <span>Download Receipt</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;

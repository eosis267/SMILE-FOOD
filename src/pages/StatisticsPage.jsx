import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import IconsaxIcon from '../components/IconsaxIcon';
import BackButton from '../components/BackButton';
import { HOURLY_ORDER_TREND, REGIONAL_STATISTICS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const StatisticsPage = () => {
  const [metricView, setMetricView] = useState('revenue'); // 'revenue' or 'orders'

  const revenueBreakdown = [
    { category: "Vendor Gross Food Value", amount: 48320, pct: "78.4%", color: "#079B48" },
    { category: "Courier Delivery Payouts", amount: 8210, pct: "13.3%", color: "#087F3C" },
    { category: "Platform Service Commission", amount: 5120, pct: "8.3%", color: "#F28C00" }
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/" label="Dashboard" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Operations & Revenue Analytics
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            Real-time delivery SLA, hourly peak loads, and escrow revenue distribution
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F5F6F5] dark:bg-[#202922] p-1 rounded-2xl border border-[#EEEEEE] dark:border-[#27332A]">
          <button
            onClick={() => setMetricView('revenue')}
            className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              metricView === 'revenue'
                ? 'bg-[#079B48] text-white shadow-sm'
                : 'text-[#777D79] dark:text-[#8E9A92]'
            }`}
          >
            Gross Revenue ($)
          </button>
          <button
            onClick={() => setMetricView('orders')}
            className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              metricView === 'orders'
                ? 'bg-[#079B48] text-white shadow-sm'
                : 'text-[#777D79] dark:text-[#8E9A92]'
            }`}
          >
            Order Volume
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="smile-card p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79]">Gross Processed GMV</span>
          <div className="text-[32px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mt-1">
            $61,650.00
          </div>
          <span className="text-[12px] font-semibold text-[#149B57] mt-1 inline-block">
            +14.8% vs last billing cycle
          </span>
        </div>

        <div className="smile-card p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79]">Average Fulfillment Time</span>
          <div className="text-[32px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mt-1">
            22.4 mins
          </div>
          <span className="text-[12px] font-semibold text-[#149B57] mt-1 inline-block">
            4.1 mins faster than 30-day benchmark
          </span>
        </div>

        <div className="smile-card p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#777D79]">Dispute & Refund Ratio</span>
          <div className="text-[32px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mt-1">
            0.42%
          </div>
          <span className="text-[12px] font-semibold text-[#079B48] mt-1 inline-block">
            Optimal escrow stability rating
          </span>
        </div>
      </div>

      {/* Main Chart: Hourly Delivery Volume & Revenue */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
              Hourly Velocity & Dinner Peak Analysis
            </h3>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
              Order volume spike concentrates between 6:00 PM – 9:00 PM
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]">
            Peak: 8:00 PM (178 Orders)
          </span>
        </div>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {metricView === 'revenue' ? (
              <AreaChart data={HOURLY_ORDER_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#079B48" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#079B48" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                <XAxis dataKey="time" stroke="#777D79" fontSize={12} tickLine={false} />
                <YAxis stroke="#777D79" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  formatter={(val) => [`$${val}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#181F1A',
                    borderColor: '#27332A',
                    borderRadius: '16px',
                    color: '#FFFFFF'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#079B48" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            ) : (
              <BarChart data={HOURLY_ORDER_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                <XAxis dataKey="time" stroke="#777D79" fontSize={12} tickLine={false} />
                <YAxis stroke="#777D79" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} orders`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#181F1A',
                    borderColor: '#27332A',
                    borderRadius: '16px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="orders" fill="#079B48" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns: Escrow Split Payouts & Top Vendors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Split Payout Breakdown */}
        <div className="smile-card p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-1">
            Escrow Payout Distribution
          </h3>
          <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mb-5">
            Automatic multi-party ledger settlement
          </p>

          <div className="space-y-4">
            {revenueBreakdown.map((item) => (
              <div key={item.category} className="p-3.5 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922]">
                <div className="flex items-center justify-between text-[13px] font-semibold mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#171917] dark:text-[#F0F5F2]">{item.category}</span>
                  </div>
                  <span className="text-[#079B48] font-bold font-['Outfit']">{item.pct}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                  <span>Total Settled:</span>
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">${item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Partner Kitchens */}
        <div className="smile-card p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
          <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-1">
            Top Performing Vendors
          </h3>
          <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] mb-5">
            Ranked by order completions & kitchen prep SLA
          </p>

          <div className="space-y-3">
            {[
              { name: "Golden Wok Delights", orders: 312, rating: 4.9, prep: "12m avg" },
              { name: "Luigi's Woodfire Pizza", orders: 245, rating: 4.8, prep: "14m avg" },
              { name: "Burger & Brioche Co.", orders: 198, rating: 4.7, prep: "11m avg" },
              { name: "Spice Symphony Indian", orders: 102, rating: 4.9, prep: "16m avg" }
            ].map((v, i) => (
              <div key={v.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#EAF8D8] text-[#079B48] font-bold text-[12px] flex items-center justify-center font-['Outfit']">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">{v.name}</p>
                    <p className="text-[11px] text-[#777D79]">{v.prep}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">{v.orders} orders</span>
                  <p className="text-[11px] font-semibold text-[#F28C00] flex items-center justify-end gap-0.5">
                    <IconsaxIcon name="star" size={11} color="#F28C00" />
                    {v.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

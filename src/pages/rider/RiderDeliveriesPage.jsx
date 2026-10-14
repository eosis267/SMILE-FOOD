import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';

const ALL_RIDER_DELIVERIES = [
  { id: '#SF-88291', customer: 'Adeola Williams', address: '14 Adeyemo Alakija, V/I', restaurant: 'Mama Cass', amount: 21.50, tip: 1.50, status: 'Active', eta: '8 mins', date: '2026-10-13', rating: null },
  { id: '#SF-88290', customer: 'Chukwuma Eze', address: 'Wuse II, Abuja', restaurant: 'Bukka Hut', amount: 18.00, tip: 2.00, status: 'Delivered', eta: null, date: '2026-10-13', rating: 5 },
  { id: '#SF-88287', customer: 'Kemi Adeyemi', address: 'Lekki Phase 1', restaurant: 'Sweet Sensation', amount: 24.50, tip: 1.50, status: 'Delivered', eta: null, date: '2026-10-13', rating: 5 },
  { id: '#SF-88283', customer: 'Ola Benson', address: 'Surulere, Lagos', restaurant: 'Mama Cass', amount: 15.00, tip: 0, status: 'Delivered', eta: null, date: '2026-10-13', rating: 4 },
  { id: '#SF-88278', customer: 'Temi Olaosebikan', address: 'Ikeja GRA', restaurant: 'Terra Kulture', amount: 32.00, tip: 3.00, status: 'Delivered', eta: null, date: '2026-10-12', rating: 5 },
  { id: '#SF-88265', customer: 'Emeka Nwachukwu', address: 'Yaba, Lagos', restaurant: 'Bukka Hut', amount: 19.50, tip: 0, status: 'Delivered', eta: null, date: '2026-10-12', rating: 5 },
  { id: '#SF-88240', customer: 'Ngozi Okonkwo', address: 'Ajah, Lagos', restaurant: 'Sweet Sensation', amount: 27.00, tip: 2.50, status: 'Delivered', eta: null, date: '2026-10-11', rating: 4 },
  { id: '#SF-88220', customer: 'Bode Adesanya', address: 'Magodo, Lagos', restaurant: 'Mama Cass', amount: 14.00, tip: 1.00, status: 'Cancelled', eta: null, date: '2026-10-11', rating: null },
];

const STATUS_CONFIG = {
  Active: { label: 'Active', bg: '#EAF8D8', text: '#079B48' },
  Delivered: { label: 'Delivered', bg: '#EAF8D8', text: '#079B48' },
  Cancelled: { label: 'Cancelled', bg: '#FDECEC', text: '#D95353' },
};

export const RiderDeliveriesPage = () => {
  const { showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ALL_RIDER_DELIVERIES.filter(d => {
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesSearch = d.customer.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    All: ALL_RIDER_DELIVERIES.length,
    Active: ALL_RIDER_DELIVERIES.filter(d => d.status === 'Active').length,
    Delivered: ALL_RIDER_DELIVERIES.filter(d => d.status === 'Delivered').length,
    Cancelled: ALL_RIDER_DELIVERIES.filter(d => d.status === 'Cancelled').length,
  };

  const handleReportIssue = (id) => showToast(`Issue reported for order ${id}. Support notified.`, 'warning');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/rider" label="Rider Hub" />
        </div>
        <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
          My Deliveries
        </h1>
        <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
          Full history of all your deliveries and their statuses.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconsaxIcon name="search" size={16} color="#AAAAAA" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search orders or customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[44px] pl-9 pr-4 rounded-[14px] bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] text-[14px] text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-[#F5F6F5] dark:bg-[#181F1A] rounded-[14px] border border-[#EEEEEE] dark:border-[#27332A]">
          {['All', 'Active', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-[11px] text-[12px] font-bold transition-all ${
                statusFilter === status
                  ? 'bg-[#079B48] text-white shadow-sm'
                  : 'text-[#777D79] dark:text-[#8E9A92] hover:bg-white dark:hover:bg-[#202922]'
              }`}
            >
              {status}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                statusFilter === status ? 'bg-white/25 text-white' : 'bg-[#EEEEEE] dark:bg-[#27332A] text-[#777D79] dark:text-[#8E9A92]'
              }`}>
                {counts[status]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#777D79] dark:text-[#8E9A92]">
            <IconsaxIcon name="box" size={40} color="#AAAAAA" />
            <p className="mt-3 font-semibold">No deliveries found</p>
          </div>
        )}
        {filtered.map((delivery) => {
          const statusCfg = STATUS_CONFIG[delivery.status] || STATUS_CONFIG.Delivered;
          return (
            <div key={delivery.id} className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[20px] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    delivery.status === 'Active' ? 'bg-[#EAF8D8]' : delivery.status === 'Cancelled' ? 'bg-[#FDECEC]' : 'bg-[#EAF8D8]'
                  }`}>
                    <IconsaxIcon
                      name={delivery.status === 'Active' ? 'scooter' : delivery.status === 'Cancelled' ? 'close-circle' : 'check-circle'}
                      size={20}
                      color={delivery.status === 'Cancelled' ? '#D95353' : '#079B48'}
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#171917] dark:text-[#F0F5F2]">{delivery.customer}</p>
                    <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">{delivery.id} · {delivery.restaurant}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[16px] font-extrabold text-[#079B48]">+₦{(delivery.amount * 100).toFixed(0).slice(0, 4)}</p>
                  {delivery.tip > 0 && <p className="text-[11px] text-[#F28C00] font-semibold">+₦{(delivery.tip * 100).toFixed(0)} tip</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-[#777D79] dark:text-[#8E9A92] mb-3">
                <IconsaxIcon name="scooter" size={13} color="#AAAAAA" />
                <span className="truncate">{delivery.address}</span>
                <span className="shrink-0">·</span>
                <span className="shrink-0">{new Date(delivery.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: statusCfg.bg, color: statusCfg.text }}
                >
                  {delivery.status === 'Active' && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#079B48] animate-pulse" />
                      <span>Active — ETA {delivery.eta}</span>
                    </span>
                  )}
                  {delivery.status === 'Delivered' && (
                    <span className="flex items-center gap-1">
                      <IconsaxIcon name="check" size={12} color="#079B48" />
                      <span>Delivered</span>
                    </span>
                  )}
                  {delivery.status === 'Cancelled' && (
                    <span className="flex items-center gap-1">
                      <IconsaxIcon name="failed" size={12} color="#D95353" />
                      <span>Cancelled</span>
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-3">
                  {delivery.rating && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: delivery.rating }).map((_, i) => (
                        <IconsaxIcon key={i} name="star" size={12} color="#F28C00" />
                      ))}
                    </div>
                  )}
                  {delivery.status === 'Cancelled' && (
                    <button
                      onClick={() => handleReportIssue(delivery.id)}
                      className="text-[12px] font-semibold text-[#D95353] hover:underline"
                    >
                      Report Issue
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiderDeliveriesPage;

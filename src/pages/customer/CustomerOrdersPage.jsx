import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { downloadOrderReceipt } from '../../lib/receiptGenerator';

const CUSTOMER_ORDERS = [
  {
    id: '#SF-88291', restaurant: 'Mama Cass Restaurant', items: ['Special Smokey Party Jollof x1', 'Fried Plantain x1'],
    total: 21500, status: 'On the Way', date: '2026-10-13 13:42', rider: 'Tunde Bakare', eta: '8 mins',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=100&fit=crop&q=80'
  },
  {
    id: '#SF-88265', restaurant: 'Sweet Sensation Kitchen', items: ['Catfish Pepper Soup x1'],
    total: 18500, status: 'Delivered', date: '2026-10-12 19:15', rider: 'Emeka Nwosu', eta: null, rating: 5,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=100&fit=crop&q=80'
  },
  {
    id: '#SF-88243', restaurant: 'Bukka Hut Grills', items: ['Grilled Suya Skewers x2', 'Chapman x1'],
    total: 26500, status: 'Delivered', date: '2026-10-11 20:30', rider: 'Tunde Bakare', eta: null, rating: 5,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&fit=crop&q=80'
  },
  {
    id: '#SF-88210', restaurant: 'Terra Kulture Lounge', items: ['Pounded Yam + Egusi x1'],
    total: 18000, status: 'Delivered', date: '2026-10-10 13:00', rider: 'Emeka Nwosu', eta: null, rating: 4,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&fit=crop&q=80'
  },
  {
    id: '#SF-88190', restaurant: 'Mama Cass Restaurant', items: ['Classic Lagos Fried Rice x1'],
    total: 13500, status: 'Cancelled', date: '2026-10-09 12:00', rider: null, eta: null, cancelReason: 'Payment declined',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&fit=crop&q=80'
  },
];

const STATUS_CONFIG = {
  'On the Way': { bg: '#EAF8D8', text: '#079B48', icon: 'scooter' },
  'Preparing': { bg: '#FEF5E7', text: '#F28C00', icon: 'clock' },
  'Delivered': { bg: '#EAF8D8', text: '#087F3C', icon: 'check-circle' },
  'Cancelled': { bg: '#FDECEC', text: '#D95353', icon: 'close-circle' },
};

export const CustomerOrdersPage = () => {
  const { showToast } = useApp();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingOrder, setRatingOrder] = useState(null);

  const filtered = CUSTOMER_ORDERS.filter(o => statusFilter === 'All' || o.status === statusFilter);
  const counts = {
    All: CUSTOMER_ORDERS.length,
    'On the Way': CUSTOMER_ORDERS.filter(o => o.status === 'On the Way').length,
    Delivered: CUSTOMER_ORDERS.filter(o => o.status === 'Delivered').length,
    Cancelled: CUSTOMER_ORDERS.filter(o => o.status === 'Cancelled').length,
  };

  const handleDownloadReceipt = (order) => {
    downloadOrderReceipt(order, user);
    showToast(`Receipt for ${order.id} downloaded!`, 'success');
  };

  const handleReorder = (order) => {
    showToast(`Reordering from ${order.restaurant}... Added to cart!`, 'success');
  };

  const handleRateOrder = (id, stars) => {
    setRatingOrder(null);
    showToast(`Thanks! You rated order ${id} — ${stars} stars ⭐`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/customer" label="Home" />
        </div>
        <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
          My Orders
        </h1>
        <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-0.5">
          Track, rate, and reorder your favourite meals.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap p-1 bg-[#F5F6F5] dark:bg-[#181F1A] rounded-[16px] border border-[#EEEEEE] dark:border-[#27332A]">
        {['All', 'On the Way', 'Delivered', 'Cancelled'].map((status) => (
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
              {counts[status] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filtered.map((order) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Delivered;
          return (
            <div key={order.id} className="bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[22px] p-5 hover:shadow-md transition-shadow">
              {/* Active delivery banner */}
              {order.status === 'On the Way' && (
                <div className="flex items-center justify-between mb-4 p-3 rounded-[14px] bg-[#EAF8D8] dark:bg-[#14301C]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#079B48] animate-pulse" />
                    <span className="text-[13px] font-bold text-[#079B48]">
                      {order.rider} is on the way — ETA {order.eta}
                    </span>
                  </div>
                  <Link
                    to="/customer/track"
                    className="text-[12px] font-bold text-[#079B48] hover:underline flex items-center gap-1"
                  >
                    Track <IconsaxIcon name="arrow-right" size={13} color="#079B48" />
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-4">
                <img
                  src={order.image}
                  alt={order.restaurant}
                  className="w-16 h-16 rounded-[14px] object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[15px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] truncate">{order.restaurant}</p>
                    <span
                      className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: cfg.bg, color: cfg.text }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92] truncate">{order.items.join(', ')}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[13px] font-bold text-[#079B48]">₦{order.total.toLocaleString()}</p>
                    <span className="text-[#DDDDDD] dark:text-[#333]">·</span>
                    <p className="text-[11px] text-[#AAAAAA]">{order.date}</p>
                    <span className="text-[#DDDDDD] dark:text-[#333]">·</span>
                    <span className="text-[11px] font-mono text-[#AAAAAA]">{order.id}</span>
                  </div>
                </div>
              </div>

              {order.cancelReason && (
                <div className="mt-3 p-3 rounded-[12px] bg-[#FDECEC] dark:bg-red-950/20 text-[#D95353] text-[12px] font-semibold flex items-center gap-2">
                  <IconsaxIcon name="failed" size={14} color="#D95353" />
                  <span>{order.cancelReason}</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
                {/* Existing rating */}
                {order.rating && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconsaxIcon key={i} name="star" size={14} color={i < order.rating ? '#F28C00' : '#CCCCCC'} />
                    ))}
                  </div>
                )}

                {/* Rate button (delivered without rating) */}
                {order.status === 'Delivered' && !order.rating && ratingOrder !== order.id && (
                  <button
                    onClick={() => setRatingOrder(order.id)}
                    className="text-[13px] font-bold text-[#079B48] hover:underline flex items-center gap-1"
                  >
                    <IconsaxIcon name="heart" size={14} color="#079B48" />
                    Rate Order
                  </button>
                )}

                {/* Inline star rating */}
                {ratingOrder === order.id && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => handleRateOrder(order.id, star)} aria-label={`Rate ${star} stars`} className="hover:scale-125 transition-transform p-0.5">
                        <IconsaxIcon name="star" size={18} color="#F28C00" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Spacer for cancelled / other states */}
                {!order.rating && order.status !== 'Delivered' && ratingOrder !== order.id && <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadReceipt(order)}
                    className="px-3.5 py-2 rounded-full border border-[#EEEEEE] dark:border-[#27332A] text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                    title="Download Order Receipt PDF"
                  >
                    <IconsaxIcon name="receipt" size={13} color="#079B48" />
                    <span>Download Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] text-[#079B48] dark:text-[#D5F28A] text-[12px] font-bold hover:bg-[#D5F28A] dark:hover:bg-[#1d4427] transition-colors flex items-center gap-1.5"
                  >
                    <IconsaxIcon name="refresh" size={13} color="#079B48" />
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerOrdersPage;

import React, { useState } from 'react';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';

const INITIAL_REVIEWS = [
  { id: 'rev-1', user: 'Adeola Williams', vendor: 'Mama Cass Restaurant', order: '#SF-84201', rating: 5, comment: 'Food arrived blazing hot and delicious! Jollof was authentic.', status: 'Approved', date: '2026-10-12' },
  { id: 'rev-2', user: 'Chukwuma Eze', vendor: 'Sweet Sensation Kitchen', order: '#SF-84156', rating: 4, comment: 'Great pepper soup, but the courier was slightly delayed by traffic.', status: 'Approved', date: '2026-10-11' },
  { id: 'rev-3', user: 'Anonymous Guest', vendor: 'Bukka Hut', order: '#SF-83990', rating: 1, comment: 'Disrespectful language from rider, packaging was torn.', status: 'Flagged', date: '2026-10-10' },
  { id: 'rev-4', user: 'Fatima Bello', vendor: 'Terra Kulture Lounge', order: '#SF-84102', rating: 5, comment: 'Exceptional catfish pepper soup. Will definitely order again.', status: 'Approved', date: '2026-10-09' },
];

const INITIAL_DISPUTES = [
  { id: 'dsp-01', order: '#SF-83990', parties: 'Customer Adeola vs Rider Emeka', issue: 'Missing drink item in sealed bag', claim: '$12.50 refund', status: 'Under Review' },
  { id: 'dsp-02', order: '#SF-83812', parties: 'Vendor Sweet Sensation vs Customer Tunde', issue: 'Customer cancelled after food prepared', claim: 'Vendor 85% compensation', status: 'Resolved' },
];

export const AdminModerationPage = () => {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'disputes'

  const toggleReviewStatus = (id) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        const next = r.status === 'Approved' ? 'Hidden' : 'Approved';
        showToast(`Review status updated to ${next}`, 'info');
        return { ...r, status: next };
      }
      return r;
    }));
  };

  const resolveDispute = (id, resolution) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'Resolved' } : d));
    showToast(`Dispute #${id} resolved: ${resolution}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/admin" label="Dashboard" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
          Review & Content Moderation
        </h2>
        <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
          Audit marketplace reviews, resolve transaction disputes, and maintain platform integrity
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
            activeTab === 'reviews'
              ? 'bg-[#079B48] text-white shadow-sm'
              : 'bg-white dark:bg-[#181F1A] text-[#777D79] dark:text-[#8E9A92] border border-[#EEEEEE] dark:border-[#27332A]'
          }`}
        >
          Customer Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
            activeTab === 'disputes'
              ? 'bg-[#079B48] text-white shadow-sm'
              : 'bg-white dark:bg-[#181F1A] text-[#777D79] dark:text-[#8E9A92] border border-[#EEEEEE] dark:border-[#27332A]'
          }`}
        >
          Dispute Resolutions ({disputes.length})
        </button>
      </div>

      {activeTab === 'reviews' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(rev => (
            <div key={rev.id} className="smile-card p-5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[28px] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[14px] text-[#171917] dark:text-[#F0F5F2]">{rev.user}</h4>
                  <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92]">{rev.vendor} · {rev.order}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5 text-[#F28C00]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <IconsaxIcon key={i} name="star" size={13} color="#F28C00" />
                    ))}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rev.status === 'Approved' ? 'bg-[#EAF8D8] text-[#079B48]' : 'bg-[#FDECEC] text-[#D95353]'
                  }`}>
                    {rev.status}
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-[#171917] dark:text-[#F0F5F2] italic bg-[#F5F6F5] dark:bg-[#202922] p-3 rounded-2xl">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-[#777D79]">{rev.date}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReviewStatus(rev.id)}
                    className="px-3 py-1 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] hover:border-[#079B48] font-bold text-[#171917] dark:text-[#F0F5F2]"
                  >
                    {rev.status === 'Approved' ? 'Hide Review' : 'Approve Review'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map(dsp => (
            <div key={dsp.id} className="smile-card p-5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-[#079B48]">{dsp.id}</span>
                  <span className="font-bold text-[14px] text-[#171917] dark:text-[#F0F5F2]">Order {dsp.order}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    dsp.status === 'Resolved' ? 'bg-[#EAF8D8] text-[#079B48]' : 'bg-[#FFF6E5] text-[#F28C00]'
                  }`}>
                    {dsp.status}
                  </span>
                </div>
                <p className="text-[12px] font-semibold text-[#777D79] dark:text-[#8E9A92]">{dsp.parties}</p>
                <p className="text-[13px] text-[#171917] dark:text-[#F0F5F2] mt-1">
                  <strong>Issue:</strong> {dsp.issue} · <strong>Claim:</strong> {dsp.claim}
                </p>
              </div>

              {dsp.status !== 'Resolved' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => resolveDispute(dsp.id, 'Approved full customer refund from escrow')}
                    className="px-3.5 py-2 rounded-xl bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold"
                  >
                    Approve Refund
                  </button>
                  <button
                    onClick={() => resolveDispute(dsp.id, 'Released full payment to restaurant/rider')}
                    className="px-3.5 py-2 rounded-xl bg-[#F5F6F5] dark:bg-[#202922] text-[#171917] dark:text-[#F0F5F2] text-[12px] font-bold hover:bg-[#EEEEEE]"
                  >
                    Dismiss Claim
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminModerationPage;

import React, { useState } from 'react';
import IconsaxIcon from '../components/IconsaxIcon';
import BackButton from '../components/BackButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { downloadOrderReceipt } from '../lib/receiptGenerator';

export const OrdersPage = () => {
  const { 
    orders, 
    setSelectedOrder, 
    createDemoOrder, 
    showToast 
  } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Sort
  const filtered = orders.filter(order => {
    if (activeTab !== 'ALL' && order.status.toUpperCase() !== activeTab) {
      return false;
    }
    if (localSearch) {
      const q = localSearch.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchCust = order.customer.name.toLowerCase().includes(q);
      const matchRest = order.restaurant.name.toLowerCase().includes(q);
      return matchNum || matchCust || matchRest;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'totalAmount') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginatedOrders = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(prev => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleCopyNumber = (e, ordNum) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(ordNum);
    showToast(`Order ${ordNum} copied to clipboard!`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/" label="Dashboard" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Orders Management
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            End-to-end state machine dispatch, escrow settlements & courier routing
          </p>
        </div>

        <button
          onClick={createDemoOrder}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white font-bold text-[13px] shadow-md shadow-[#079B48]/20 transition-all self-start sm:self-auto"
        >
          <span>+ New Customer Order</span>
        </button>
      </div>

      {/* Filter Tabs & Local Search */}
      <div className="smile-card p-5 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[28px] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: `All (${orders.length})` },
            { id: 'COMPLETED', label: `Completed (${orders.filter(o => o.status === 'Completed').length})` },
            { id: 'PENDING', label: `In Transit (${orders.filter(o => o.status === 'Pending').length})` },
            { id: 'FAILED', label: `Failed/Cancelled (${orders.filter(o => o.status === 'Failed').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-2xl text-[13px] font-bold shrink-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#079B48] text-white shadow-sm'
                  : 'bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] dark:text-[#8E9A92] hover:text-[#171917] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="pill-search flex items-center px-3.5 py-2 gap-2 bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A]">
            <IconsaxIcon name="search" size={16} color="#777D79" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search order, customer..."
              className="w-full bg-transparent text-[12px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
            />
            {localSearch && (
              <button onClick={() => setLocalSearch('')} aria-label="Clear Search" className="text-[#777D79] hover:text-[#171917] dark:hover:text-[#F0F5F2]">
                <IconsaxIcon name="close" size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="smile-card p-6 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] dark:border-[#27332A] text-[#777D79] dark:text-[#8E9A92]">
                <th 
                  onClick={() => handleSort('orderNumber')}
                  className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] cursor-pointer hover:text-[#079B48]"
                >
                  ORDER NUMBER {sortField === 'orderNumber' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">CUSTOMER & ADDRESS</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">VENDOR</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">LIFECYCLE STEP</th>
                <th 
                  onClick={() => handleSort('totalAmount')}
                  className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] cursor-pointer hover:text-[#079B48]"
                >
                  AMOUNT {sortField === 'totalAmount' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">ESCROW</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]/70 dark:divide-[#27332A]/70">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777D79]">
                    No orders found matching the filter.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-[#F5F6F5]/60 dark:hover:bg-[#202922]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-3 font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                      <div className="flex items-center gap-1.5">
                        <span className="group-hover:text-[#079B48] transition-colors">{order.orderNumber}</span>
                        <button
                          onClick={(e) => handleCopyNumber(e, order.orderNumber)}
                          className="opacity-0 group-hover:opacity-100 text-[#777D79] hover:text-[#079B48] transition-opacity"
                        >
                          <IconsaxIcon name="copy" size={13} />
                        </button>
                      </div>
                      <span className="text-[11px] font-normal text-[#777D79] dark:text-[#8E9A92] block">
                        {order.timestamp}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="font-semibold text-[#171917] dark:text-[#F0F5F2]">
                        {order.customer.name}
                      </div>
                      <div className="text-[11px] text-[#777D79] dark:text-[#8E9A92] line-clamp-1">
                        {order.customer.address}
                      </div>
                    </td>

                    <td className="py-4 px-3 font-medium text-[#171917] dark:text-[#F0F5F2]">
                      {order.restaurant.name}
                    </td>

                    <td className="py-4 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        order.stateMachineStep === 'Delivered'
                          ? 'bg-[#EAF8D8] text-[#149B57] dark:bg-[#14301C] dark:text-[#D5F28A]'
                          : order.stateMachineStep === 'Cancelled'
                          ? 'bg-[#FDECEC] text-[#D95353] dark:bg-[#331414] dark:text-[#E56262]'
                          : 'bg-[#FFF6E5] text-[#F28C00] dark:bg-[#332210] dark:text-[#F28C00]'
                      }`}>
                        <span>•</span>
                        <span>{order.stateMachineStep}</span>
                      </span>
                    </td>

                    <td className="py-4 px-3 font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] text-[14px]">
                      ₦{order.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-4 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.escrowStatus === 'RELEASED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : order.escrowStatus === 'LOCKED'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}>
                        {order.escrowStatus}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadOrderReceipt(order, user);
                            showToast(`Downloaded receipt for ${order.orderNumber}!`, 'success');
                          }}
                          title="Download PDF Receipt"
                          className="p-1.5 rounded-lg bg-[#EAF8D8] hover:bg-[#D5F28A] dark:bg-[#14301C] dark:hover:bg-[#1f4a2b] text-[#079B48] dark:text-[#D5F28A] transition-all active:scale-95 shadow-sm"
                        >
                          <IconsaxIcon name="receipt" size={14} color="#079B48" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="px-3 py-1.5 rounded-xl bg-[#F5F6F5] dark:bg-[#202922] text-[#079B48] hover:bg-[#EAF8D8] dark:hover:bg-[#14301C] text-[12px] font-bold transition-all"
                        >
                          Details →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-5 mt-3 border-t border-[#EEEEEE] dark:border-[#27332A]">
          <span className="text-[12px] font-semibold text-[#777D79] dark:text-[#8E9A92]">
            Page {currentPage} of {totalPages} ({sorted.length} total orders)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] text-[12px] font-bold text-[#777D79] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] text-[12px] font-bold text-[#777D79] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

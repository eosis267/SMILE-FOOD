import React, { useState } from 'react';
import IconsaxIcon from './IconsaxIcon';
import { useApp } from '../context/AppContext';

export const FilterModal = ({ isOpen, onClose }) => {
  const { filters, setFilters, showToast } = useApp();

  const [localStatus, setLocalStatus] = useState(filters.status || []);
  const [localRange, setLocalRange] = useState(filters.dateRange || 'Today');
  const [localRegion, setLocalRegion] = useState(filters.region || 'all');
  const [localMin, setLocalMin] = useState(filters.minAmount || 0);
  const [localMax, setLocalMax] = useState(filters.maxAmount || 200);

  if (!isOpen) return null;

  const toggleStatus = (st) => {
    setLocalStatus(prev => 
      prev.includes(st) ? prev.filter(x => x !== st) : [...prev, st]
    );
  };

  const handleApply = () => {
    setFilters({
      status: localStatus,
      dateRange: localRange,
      region: localRegion,
      minAmount: Number(localMin),
      maxAmount: Number(localMax)
    });
    showToast('Filters applied to dashboard & tables', 'success');
    onClose();
  };

  const handleReset = () => {
    setLocalStatus([]);
    setLocalRange('Today');
    setLocalRegion('all');
    setLocalMin(0);
    setLocalMax(200);
    setFilters({
      status: [],
      dateRange: 'Today',
      region: 'all',
      minAmount: 0,
      maxAmount: 200
    });
    showToast('All filters reset to default', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE] dark:border-[#27332A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center">
              <IconsaxIcon name="filter" size={18} />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                Filter Orders & Ledger
              </h2>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                Refine delivery and transaction results
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close Filter"
            className="w-8 h-8 rounded-full bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] hover:text-[#171917] dark:hover:text-[#F0F5F2] flex items-center justify-center text-sm transition-colors"
          >
            <IconsaxIcon name="close" size={16} />
          </button>
        </div>

        <div className="py-5 space-y-5">
          {/* Status Multi-select */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2">
              Order Status
            </label>
            <div className="flex flex-wrap gap-2">
              {['Completed', 'Pending', 'Failed'].map((st) => {
                const active = localStatus.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleStatus(st)}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-all ${
                      active
                        ? 'bg-[#079B48] text-white border-[#079B48] shadow-sm'
                        : 'bg-[#F5F6F5] dark:bg-[#202922] text-[#171917] dark:text-[#F0F5F2] border-[#EEEEEE] dark:border-[#27332A] hover:border-[#079B48]'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional Area */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2">
              Delivery Region
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Regions' },
                { id: 'Central area', label: 'Central (52%)' },
                { id: 'Eastern area', label: 'Eastern (33%)' },
                { id: 'South-Western area', label: 'South-West (15%)' }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setLocalRegion(r.id)}
                  className={`p-2 rounded-2xl text-[12px] font-semibold border text-center transition-all ${
                    localRegion === r.id
                      ? 'bg-[#EAF8D8] text-[#079B48] border-[#079B48] font-bold dark:bg-[#14301C] dark:text-[#D5F28A]'
                      : 'bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] border-[#EEEEEE] dark:border-[#27332A]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Bounds */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2">
              Amount Bounds ($)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] rounded-2xl px-3 py-2">
                <span className="text-[13px] text-[#777D79] mr-1">$</span>
                <input
                  type="number"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  placeholder="Min"
                  className="w-full bg-transparent text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
                />
              </div>
              <span className="text-[#777D79] font-bold">—</span>
              <div className="flex-1 flex items-center bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] rounded-2xl px-3 py-2">
                <span className="text-[13px] text-[#777D79] mr-1">$</span>
                <input
                  type="number"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  placeholder="Max"
                  className="w-full bg-transparent text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#EEEEEE] dark:border-[#27332A] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-[13px] font-semibold text-[#777D79] hover:text-[#171917] dark:hover:text-white"
          >
            Reset All
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#777D79] hover:bg-[#F5F6F5] dark:hover:bg-[#202922]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/20"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

import React, { useState } from 'react';
import IconsaxIcon from './IconsaxIcon';
import FilterModal from './FilterModal';
import { useApp } from '../context/AppContext';

export const Toolbar = () => {
  const { 
    filters, 
    setFilters, 
    isFilterModalOpen, 
    setIsFilterModalOpen,
    handleExportPDF 
  } = useApp();

  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const dateOptions = ['Today', 'Last 7 days', 'Last 30 days', 'Custom'];

  const activeFiltersCount = 
    (filters.status.length > 0 ? 1 : 0) + 
    (filters.region !== 'all' ? 1 : 0) +
    (filters.minAmount > 0 || filters.maxAmount < 200 ? 1 : 0);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-7">
      <div className="flex items-center gap-2">
        <h2 className="text-[20px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
          Overview Dashboard
        </h2>
        <span className="text-[12px] font-medium text-[#777D79] dark:text-[#8E9A92]">
          • Live Metrics & Escrow Status
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Filters Button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-semibold transition-all shadow-sm ${
            activeFiltersCount > 0
              ? 'bg-[#EAF8D8] text-[#079B48] border-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]'
              : 'bg-white dark:bg-[#181F1A] text-[#171917] dark:text-[#F0F5F2] border-[#EEEEEE] dark:border-[#27332A] hover:border-[#079B48]'
          }`}
        >
          <IconsaxIcon name="filter" size={17} color={activeFiltersCount > 0 ? '#079B48' : 'currentColor'} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#079B48] text-white text-[11px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Date Range Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDateDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] hover:border-[#079B48] transition-all shadow-sm"
          >
            <IconsaxIcon name="calendar" size={17} color="#777D79" />
            <span>{filters.dateRange}</span>
            <IconsaxIcon name="chevron-down" size={14} color="#777D79" />
          </button>

          {isDateDropdownOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-2xl shadow-xl py-1.5 z-40 animate-in fade-in duration-100">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, dateRange: opt }));
                    setIsDateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[13px] font-semibold transition-colors flex items-center justify-between ${
                    filters.dateRange === opt
                      ? 'bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]'
                      : 'text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922]'
                  }`}
                >
                  <span>{opt}</span>
                  {filters.dateRange === opt && (
                    <IconsaxIcon name="completed" size={14} color="#079B48" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export PDF Button (Primary green button with jsPDF) */}
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/25 hover:shadow-lg hover:shadow-[#079B48]/35 active:scale-95"
        >
          <IconsaxIcon name="pdf" size={18} color="#FFFFFF" />
          <span>Export PDF</span>
        </button>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};

export default Toolbar;

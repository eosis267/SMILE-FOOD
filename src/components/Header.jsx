import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconsaxIcon from './IconsaxIcon';
import NotificationPopover from './NotificationPopover';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    unreadCount, 
    createDemoOrder,
    setIsLedgerModalOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    showToast 
  } = useApp();

  const { displayName, user, userRole, signOut } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await signOut();
    showToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  const currentName = displayName || 'Mike Adeleke';
  const currentRole = userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'Operations Lead';
  const currentEmail = user?.email || 'mike.ops@smilefood.com';

  return (
    <header className="h-[76px] sm:h-[88px] px-4 sm:px-8 flex items-center justify-between border-b border-[#EEEEEE] dark:border-[#27332A] bg-white/80 dark:bg-[#181F1A]/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      {/* Mobile Hamburger & Greeting */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="lg:hidden w-10 h-10 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] flex items-center justify-center text-[#171917] dark:text-[#F0F5F2] hover:bg-[#EEEEEE] dark:hover:bg-[#27332A] transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          <IconsaxIcon name={mobileMenuOpen ? "close" : "category"} size={20} />
        </button>

        <div className="flex flex-col justify-center">
          <h1 className="text-[20px] sm:text-[26px] lg:text-[28px] font-extrabold tracking-tight text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] leading-none">
            Hello, {currentName.split(' ')[0]}!
          </h1>
          <p className="text-[11px] sm:text-[12px] font-semibold text-[#777D79] dark:text-[#8E9A92] mt-0.5 sm:mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#149B57] inline-block animate-pulse" />
            <span className="truncate max-w-[150px] sm:max-w-none">Live Operations active</span>
          </p>
        </div>
      </div>

      {/* Pill-shaped Search Bar */}
      <div className="relative hidden md:block w-56 lg:w-80 xl:w-96">
        <div className="pill-search flex items-center px-4 py-2.5 gap-3 bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A]">
          <IconsaxIcon name="search" size={18} color="#777D79" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything here..."
            className="w-full bg-transparent text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] placeholder-[#777D79] dark:placeholder-[#8E9A92] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#777D79] hover:text-[#171917] dark:hover:text-white"
              aria-label="Clear search"
            >
              <IconsaxIcon name="close" size={14} />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-[#777D79] bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A]">
            ⌘K
          </span>
        </div>
      </div>

      {/* Action Controls & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* Quick Simulator Webhook Trigger */}
        <button
          onClick={createDemoOrder}
          title="Simulate incoming order payment webhook"
          className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#EAF8D8] text-[#079B48] hover:bg-[#D5F28A] dark:bg-[#14301C] dark:text-[#D5F28A] text-[12px] font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-[#079B48]" />
          <span>+ Sim Webhook</span>
        </button>

        {/* Ledger Inspector Button */}
        <button
          onClick={() => setIsLedgerModalOpen(true)}
          title="Open ACID Double-Entry Ledger Inspector"
          className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[#171917] dark:text-[#F0F5F2] text-[12px] font-bold hover:border-[#079B48] transition-all"
        >
          <IconsaxIcon name="wallet" size={15} color="#079B48" />
          <span>Audit Ledger</span>
        </button>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="w-11 h-11 rounded-full bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] flex items-center justify-center text-[#171917] dark:text-[#F0F5F2] hover:bg-[#EAF8D8] hover:text-[#079B48] transition-colors relative"
            aria-label="Notifications"
          >
            <IconsaxIcon name="bell" size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#079B48] ring-2 ring-white dark:ring-[#181F1A]" />
            )}
          </button>

          <NotificationPopover
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(prev => !prev)}
            className="flex items-center gap-3 p-1.5 pr-2.5 rounded-full hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors"
          >
            <div className="w-10 h-10 rounded-full ring-2 ring-[#079B48] overflow-hidden bg-cover bg-center shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces"
                alt="Mike Adeleke Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] leading-none">
                {currentName}
              </p>
              <p className="text-[11px] font-medium text-[#777D79] dark:text-[#8E9A92] mt-0.5">
                {currentRole}
              </p>
            </div>
            <IconsaxIcon name="chevron-down" size={14} color="#777D79" />
          </button>

          {/* Profile Popover Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-56 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
                <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">{currentName}</p>
                <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92] truncate">{currentEmail}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/admin/profile'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] flex items-center gap-2.5"
                >
                  <IconsaxIcon name="user" size={16} color="#079B48" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/admin/settings'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] flex items-center gap-2.5"
                >
                  <IconsaxIcon name="settings" size={16} color="#777D79" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="border-t border-[#EEEEEE] dark:border-[#27332A] pt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#D95353] hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2.5"
                >
                  <IconsaxIcon name="failed" size={16} color="#D95353" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

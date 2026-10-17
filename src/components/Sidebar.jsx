import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import IconsaxIcon from './IconsaxIcon';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { darkMode, toggleDarkMode, unreadCount, orders, showToast } = useApp();

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  const mainNavLinks = [
    { name: 'Overview', path: '/', icon: 'overview' },
    { name: 'Orders', path: '/orders', icon: 'orders', badge: pendingOrdersCount },
    { name: 'Messages', path: '/messages', icon: 'messages', badge: unreadCount },
    { name: 'Statistics', path: '/statistics', icon: 'statistics' },
    { name: 'Wallet', path: '/wallet', icon: 'wallet' },
    { name: 'Profile', path: '/profile', icon: 'profile' },
  ];

  const supportNavLinks = [
    { name: 'Settings', path: '/settings', icon: 'settings' },
    { name: 'Help', path: '/help', icon: 'help' },
  ];

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('https://smilefood.delivery/refer/MIKE-50');
    showToast('Referral link copied to clipboard! (MIKE-50)', 'success');
  };

  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto bg-[#FFFFFF] dark:bg-[#181F1A] border-r border-[#EEEEEE] dark:border-[#27332A] flex-col justify-between p-5 transition-colors select-none z-20">
      <div>
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 px-2 py-3 mb-6 group">
          <div className="w-10 h-10 rounded-2xl bg-[#079B48] flex items-center justify-center text-white shadow-md shadow-[#079B48]/20 group-hover:scale-105 transition-transform">
            <IconsaxIcon name="brand-smile" size={24} color="white" />
          </div>
          <div>
            <span className="font-extrabold text-[20px] tracking-tight text-[#079B48] font-['Outfit'] block leading-none">
              SMILE FOOD
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#777D79] dark:text-[#8E9A92] mt-0.5 block">
              Admin & Ops
            </span>
          </div>
        </Link>

        {/* MAIN Navigation Section */}
        <div className="mb-7">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2.5">
            Main
          </p>
          <nav className="space-y-1">
            {mainNavLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A] font-bold' 
                    : 'text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] hover:text-[#171917] dark:hover:text-[#F0F5F2]'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <IconsaxIcon 
                        name={item.icon} 
                        size={20} 
                        color={isActive ? '#079B48' : 'currentColor'} 
                      />
                      <span>{item.name}</span>
                    </div>

                    {/* Active vertical indicator bar */}
                    {isActive && (
                      <span className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#079B48] rounded-l-full shadow-sm" />
                    )}

                    {/* Badges for orders or messages */}
                    {item.badge > 0 && !isActive && (
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#EAF8D8] dark:bg-[#1C3322] text-[#079B48] dark:text-[#D5F28A]">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* SUPPORT Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2.5">
            Support
          </p>
          <nav className="space-y-1">
            {supportNavLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A] font-bold' 
                    : 'text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] hover:text-[#171917] dark:hover:text-[#F0F5F2]'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <IconsaxIcon 
                        name={item.icon} 
                        size={20} 
                        color={isActive ? '#079B48' : 'currentColor'} 
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <span className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#079B48] rounded-l-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] hover:text-[#171917] dark:hover:text-[#F0F5F2] transition-colors"
            >
              <div className="flex items-center gap-3">
                <IconsaxIcon 
                  name={darkMode ? 'sun' : 'moon'} 
                  size={20} 
                  color={darkMode ? '#F28C00' : '#079B48'} 
                />
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-[#079B48]' : 'bg-[#E0E0E0]'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Referral Promotional Card */}
      <div className="mt-6 p-4 rounded-[24px] bg-gradient-to-br from-[#079B48] to-[#087F3C] text-white shadow-lg shadow-[#079B48]/15 relative overflow-hidden">
        {/* Diffused glow background shape */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#D5F28A]/20 blur-xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <IconsaxIcon name="gift" size={16} color="#FFFFFF" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D5F28A]">
            Refer & Win
          </span>
        </div>

        <p className="text-[13px] font-bold leading-tight mb-1">
          Earn $50 when you refer!
        </p>
        <p className="text-[11px] text-white/80 mb-3 leading-snug">
          Invite restaurant vendors or courier fleets to SMILE FOOD.
        </p>

        <button
          onClick={handleCopyReferral}
          className="w-full py-2 px-3 rounded-xl bg-white text-[#079B48] hover:bg-[#EAF8D8] text-[12px] font-bold transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>Share Link</span>
          <IconsaxIcon name="copy" size={13} color="#079B48" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

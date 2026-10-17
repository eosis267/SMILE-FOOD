import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import IconsaxIcon from './IconsaxIcon';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/**
 * Mobile Drawer Backdrop & Container Wrapper
 */
const MobileDrawer = ({ isOpen, onClose, title, subtitle, icon, color = '#079B48', children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside className="relative w-[280px] max-w-[85vw] h-full bg-white dark:bg-[#181F1A] border-r border-[#EEEEEE] dark:border-[#27332A] flex flex-col justify-between p-5 z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-250">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EEEEEE] dark:border-[#27332A]">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: color }}
              >
                <IconsaxIcon name={icon} size={20} color="white" />
              </div>
              <div>
                <span className="font-extrabold text-[17px] tracking-tight text-[#079B48] font-['Outfit'] block leading-none">SMILE FOOD</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#777D79] dark:text-[#8E9A92] mt-0.5 block">{subtitle}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F6F5] dark:bg-[#202922] flex items-center justify-center text-[#777D79] hover:text-[#171917] dark:hover:text-white"
              aria-label="Close menu"
            >
              <IconsaxIcon name="close" size={16} />
            </button>
          </div>
          {children}
        </div>
      </aside>
    </div>
  );
};

/**
 * SMILE FOOD — Admin Portal Sidebar
 */
export const AdminSidebar = () => {
  const { darkMode, toggleDarkMode, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Overview', path: '/admin', icon: 'overview', end: true },
    { name: 'Orders', path: '/admin/orders', icon: 'orders' },
    { name: 'Messages', path: '/admin/messages', icon: 'messages' },
    { name: 'Statistics', path: '/admin/statistics', icon: 'statistics' },
    { name: 'Wallet & Ledger', path: '/admin/wallet', icon: 'wallet' },
  ];

  const managementLinks = [
    { name: 'All Users', path: '/admin/users', icon: 'profile' },
    { name: 'Ledger Audit', path: '/admin/ledger', icon: 'database' },
    { name: 'Moderation', path: '/admin/moderation', icon: 'shield-check' },
  ];

  const supportLinks = [
    { name: 'Settings', path: '/admin/settings', icon: 'settings' },
    { name: 'Help', path: '/admin/help', icon: 'help' },
  ];

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  const NavItem = ({ item, end = false }) => (
    <NavLink
      to={item.path}
      end={end}
      onClick={() => setMobileMenuOpen(false)}
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
            <IconsaxIcon name={item.icon} size={20} color={isActive ? '#079B48' : 'currentColor'} />
            <span>{item.name}</span>
          </div>
          {isActive && <span className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#079B48] rounded-l-full shadow-sm" />}
        </>
      )}
    </NavLink>
  );

  const sidebarContent = (
    <>
      <div className="mb-5">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2">Main</p>
        <nav className="space-y-1">
          {navLinks.map((item) => <NavItem key={item.name} item={item} end={item.end} />)}
        </nav>
      </div>

      <div className="mb-5">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2">Management</p>
        <nav className="space-y-1">
          {managementLinks.map((item) => <NavItem key={item.name} item={item} />)}
        </nav>
      </div>

      <div>
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2">Support</p>
        <nav className="space-y-1">
          {supportLinks.map((item) => <NavItem key={item.name} item={item} />)}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] hover:text-[#171917] dark:hover:text-[#F0F5F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconsaxIcon name={darkMode ? 'sun' : 'moon'} size={20} color={darkMode ? '#F28C00' : '#079B48'} />
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-[#079B48]' : 'bg-[#E0E0E0]'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Slide-over Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="SMILE FOOD"
        subtitle="Admin Portal"
        icon="brand-smile"
        color="#079B48"
      >
        {sidebarContent}
        <div className="mt-6 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#3D1414] transition-colors"
          >
            <IconsaxIcon name="arrow-left" size={18} color="#D95353" />
            Sign Out
          </button>
        </div>
      </MobileDrawer>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-[240px] shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto bg-white dark:bg-[#181F1A] border-r border-[#EEEEEE] dark:border-[#27332A] flex-col justify-between p-5 transition-colors select-none z-20">
        <div>
          <Link to="/admin" className="flex items-center gap-2.5 px-2 py-3 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-[#079B48] flex items-center justify-center text-white shadow-md shadow-[#079B48]/20 group-hover:scale-105 transition-transform">
              <IconsaxIcon name="brand-smile" size={24} color="white" />
            </div>
            <div>
              <span className="font-extrabold text-[20px] tracking-tight text-[#079B48] font-['Outfit'] block leading-none">SMILE FOOD</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777D79] dark:text-[#8E9A92] mt-0.5 block">Admin Portal</span>
            </div>
          </Link>
          {sidebarContent}
        </div>

        <div className="mt-6 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#3D1414] transition-colors"
          >
            <IconsaxIcon name="arrow-left" size={18} color="#D95353" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

/**
 * Customer Portal Sidebar & Mobile Bottom Navigation Bar
 */
export const CustomerSidebar = () => {
  const { darkMode, toggleDarkMode, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/customer', icon: 'overview', end: true },
    { name: 'Explore', path: '/customer/explore', icon: 'search' },
    { name: 'My Orders', path: '/customer/orders', icon: 'orders' },
    { name: 'Cart', path: '/customer/cart', icon: 'box' },
    { name: 'Track Order', path: '/customer/track', icon: 'scooter' },
    { name: 'Wallet', path: '/customer/wallet', icon: 'wallet' },
    { name: 'Profile', path: '/customer/profile', icon: 'profile' },
    { name: 'Settings', path: '/customer/settings', icon: 'settings' },
    { name: 'Help', path: '/customer/help', icon: 'help' },
  ];

  const bottomNavLinks = [
    { name: 'Home', path: '/customer', icon: 'overview', end: true },
    { name: 'Explore', path: '/customer/explore', icon: 'search' },
    { name: 'Orders', path: '/customer/orders', icon: 'orders' },
    { name: 'Cart', path: '/customer/cart', icon: 'box' },
    { name: 'Wallet', path: '/customer/wallet', icon: 'wallet' },
  ];

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={() => setMobileMenuOpen(false)}
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
            <IconsaxIcon name={item.icon} size={20} color={isActive ? '#079B48' : 'currentColor'} />
            <span>{item.name}</span>
          </div>
          {isActive && <span className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#079B48] rounded-l-full" />}
        </>
      )}
    </NavLink>
  );

  const customerContent = (
    <nav className="space-y-1">
      {navLinks.map((item) => <NavItem key={item.name} item={item} />)}
      <button
        onClick={toggleDarkMode}
        className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors"
      >
        <div className="flex items-center gap-3">
          <IconsaxIcon name={darkMode ? 'sun' : 'moon'} size={20} color={darkMode ? '#F28C00' : '#079B48'} />
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-[#079B48]' : 'bg-[#E0E0E0]'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </button>
    </nav>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="SMILE FOOD"
        subtitle="Customer"
        icon="brand-smile"
        color="#079B48"
      >
        {customerContent}
        <div className="mt-6 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#3D1414] transition-colors"
          >
            <IconsaxIcon name="arrow-left" size={18} color="#D95353" />
            Sign Out
          </button>
        </div>
      </MobileDrawer>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-[240px] shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto bg-white dark:bg-[#181F1A] border-r border-[#EEEEEE] dark:border-[#27332A] flex-col justify-between p-5 transition-colors select-none z-20">
        <div>
          <Link to="/customer" className="flex items-center gap-2.5 px-2 py-3 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-[#079B48] flex items-center justify-center text-white shadow-md shadow-[#079B48]/20">
              <IconsaxIcon name="brand-smile" size={24} color="white" />
            </div>
            <div>
              <span className="font-extrabold text-[20px] tracking-tight text-[#079B48] font-['Outfit'] block leading-none">SMILE FOOD</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777D79] dark:text-[#8E9A92] mt-0.5 block">Customer</span>
            </div>
          </Link>
          {customerContent}
        </div>
        <div className="mt-6 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#3D1414] transition-colors"
          >
            <IconsaxIcon name="arrow-left" size={18} color="#D95353" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar for Customers */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#181F1A]/95 backdrop-blur-lg border-t border-[#EEEEEE] dark:border-[#27332A] px-2 py-2 flex items-center justify-around shadow-xl">
        {bottomNavLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive 
                  ? 'text-[#079B48] dark:text-[#D5F28A] font-bold' 
                  : 'text-[#777D79] dark:text-[#8E9A92]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <IconsaxIcon name={item.icon} size={19} color={isActive ? '#079B48' : 'currentColor'} />
                <span className="text-[10px] mt-0.5">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

/**
 * Vendor Portal Sidebar
 */
export const VendorSidebar = () => {
  const { darkMode, toggleDarkMode, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const { signOut, displayName } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Kitchen Dashboard', path: '/vendor', icon: 'overview', end: true },
    { name: 'Orders', path: '/vendor/orders', icon: 'orders' },
    { name: 'Menu Management', path: '/vendor/menu', icon: 'shop' },
    { name: 'Earnings', path: '/vendor/earnings', icon: 'wallet' },
    { name: 'Profile', path: '/vendor/profile', icon: 'profile' },
    { name: 'Settings', path: '/vendor/settings', icon: 'settings' },
  ];

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={() => setMobileMenuOpen(false)}
      className={({ isActive }) => `
        relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200
        ${isActive
          ? 'bg-[#FEF5E7] text-[#F28C00] dark:bg-[#2A1F0A] dark:text-[#FFEAAA] font-bold'
          : 'text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] hover:text-[#171917] dark:hover:text-[#F0F5F2]'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <IconsaxIcon name={item.icon} size={20} color={isActive ? '#F28C00' : 'currentColor'} />
            <span>{item.name}</span>
          </div>
          {isActive && <span className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#F28C00] rounded-l-full" />}
        </>
      )}
    </NavLink>
  );

  const vendorContent = (
    <nav className="space-y-1">
      {navLinks.map((item) => <NavItem key={item.name} item={item} />)}
      <button
        onClick={toggleDarkMode}
        className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors"
      >
        <div className="flex items-center gap-3">
          <IconsaxIcon name={darkMode ? 'sun' : 'moon'} size={20} color={darkMode ? '#F28C00' : '#079B48'} />
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-[#F28C00]' : 'bg-[#E0E0E0]'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </button>
    </nav>
  );

  return (
    <>
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="SMILE FOOD"
        subtitle="Vendor Portal"
        icon="shop"
        color="#F28C00"
      >
        {vendorContent}
        <div className="mt-6 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#3D1414] transition-colors"
          >
            <IconsaxIcon name="arrow-left" size={18} color="#D95353" />
            Sign Out
          </button>
        </div>
      </MobileDrawer>

      <aside className="hidden lg:flex w-[240px] shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto bg-white dark:bg-[#181F1A] border-r border-[#EEEEEE] dark:border-[#27332A] flex-col justify-between p-5 transition-colors select-none z-20">
        <div>
          <Link to="/vendor" className="flex items-center gap-2.5 px-2 py-3 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-[#F28C00] flex items-center justify-center text-white shadow-md shadow-[#F28C00]/20">
              <IconsaxIcon name="shop" size={22} color="white" />
            </div>
            <div>
              <span className="font-extrabold text-[16px] tracking-tight text-[#F28C00] font-['Outfit'] block leading-none truncate max-w-[140px]">{displayName || 'My Restaurant'}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777D79] dark:text-[#8E9A92] mt-0.5 block">Vendor Portal</span>
            </div>
          </Link>
          {vendorContent}
        </div>
        <div className="mt-6 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#3D1414] transition-colors"
          >
            <IconsaxIcon name="arrow-left" size={18} color="#D95353" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

/**
 * Rider Portal Sidebar
 */
export const RiderSidebar = () => {
  const { darkMode, toggleDarkMode, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Rider Hub', path: '/rider', icon: 'overview', end: true },
    { name: 'My Deliveries', path: '/rider/deliveries', icon: 'scooter' },
    { name: 'Earnings', path: '/rider/earnings', icon: 'wallet' },
    { name: 'Profile', path: '/rider/profile', icon: 'profile' },
    { name: 'Settings', path: '/rider/settings', icon: 'settings' },
  ];

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={() => setMobileMenuOpen(false)}
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
            <IconsaxIcon name={item.icon} size={20} color={isActive ? '#079B48' : 'currentColor'} />
            <span>{item.name}</span>
          </div>
          {isActive && <span className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#079B48] rounded-l-full" />}
        </>
      )}
    </NavLink>
  );

  const riderContent = (
    <nav className="space-y-1">
      {navLinks.map((item) => <NavItem key={item.name} item={item} />)}
      <button
        onClick={toggleDarkMode}
        className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors"
      >
        <div className="flex items-center gap-3">
          <IconsaxIcon name={darkMode ? 'sun' : 'moon'} size={20} color={darkMode ? '#F28C00' : '#079B48'} />
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-[#079B48]' : 'bg-[#E0E0E0]'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </button>
    </nav>
  );

  return (
    <>
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="SMILE FOOD"
        subtitle="Rider Portal"
        icon="scooter"
        color="#079B48"
      >
        {riderContent}
        <div className="mt-6 pt-4 border-t border-[#EEEEEE] dark:border-[#27332A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#3D1414] transition-colors"
          >
            <IconsaxIcon name="arrow-left" size={18} color="#D95353" />
            Sign Out
          </button>
        </div>
      </MobileDrawer>

      <aside className="hidden lg:flex w-[240px] shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto bg-white dark:bg-[#181F1A] border-r border-[#EEEEEE] dark:border-[#27332A] flex-col justify-between p-5 transition-colors select-none z-20">
        <div>
          <Link to="/rider" className="flex items-center gap-2.5 px-2 py-3 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-[#079B48] flex items-center justify-center text-white shadow-md shadow-[#079B48]/20">
              <IconsaxIcon name="scooter" size={24} color="white" />
            </div>
            <div>
              <span className="font-extrabold text-[20px] tracking-tight text-[#079B48] font-['Outfit'] block leading-none">SMILE FOOD</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777D79] dark:text-[#8E9A92] mt-0.5 block">Rider Portal</span>
            </div>
          </Link>
          {riderContent}
        </div>

        <div className="space-y-3 mt-4">
          <div className="p-4 rounded-[20px] bg-gradient-to-br from-[#079B48] to-[#087F3C] text-white shadow-lg shadow-[#079B48]/15 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-[#D5F28A]/20 blur-xl pointer-events-none" />
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#D5F28A] mb-1">Today's Earnings</p>
            <p className="text-[22px] font-black font-['Outfit']">₦8,420</p>
            <p className="text-[11px] text-white/80 flex items-center gap-1">
              <span>12 deliveries · 4.9</span>
              <IconsaxIcon name="star" size={11} color="#D5F28A" variant="bold" />
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#3D1414] transition-colors"
          >
            <IconsaxIcon name="arrow-left" size={18} color="#D95353" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

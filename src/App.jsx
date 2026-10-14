import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import OrderDetailModal from './components/OrderDetailModal';
import LedgerAuditModal from './components/LedgerAuditModal';
import IconsaxIcon from './components/IconsaxIcon';

// ─── Portal Sidebars ────────────────────────────────────────────────────────
import {
  AdminSidebar,
  CustomerSidebar,
  VendorSidebar,
  RiderSidebar,
} from './components/PortalSidebars';

// ─── Admin Dashboard Pages ──────────────────────────────────────────────────
import Overview from './pages/Overview';
import OrdersPage from './pages/OrdersPage';
import MessagesPage from './pages/MessagesPage';
import StatisticsPage from './pages/StatisticsPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminLedgerPage } from './pages/admin/AdminLedgerPage';
import { AdminModerationPage } from './pages/admin/AdminModerationPage';

// ─── Customer Portal Pages ──────────────────────────────────────────────────
import { CustomerHomePage } from './pages/customer/CustomerHomePage';
import { CustomerExplorePage } from './pages/customer/CustomerExplorePage';
import { CustomerCartPage } from './pages/customer/CustomerCartPage';
import { CustomerTrackingPage } from './pages/customer/CustomerTrackingPage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';

// ─── Vendor Portal Pages ────────────────────────────────────────────────────
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { VendorOrdersPage } from './pages/vendor/VendorOrdersPage';
import { VendorMenuPage } from './pages/vendor/VendorMenuPage';
import { VendorEarningsPage } from './pages/vendor/VendorEarningsPage';

// ─── Rider Portal Pages ─────────────────────────────────────────────────────
import { RiderDashboard } from './pages/rider/RiderDashboard';
import { RiderDeliveriesPage } from './pages/rider/RiderDeliveriesPage';
import { RiderEarningsPage } from './pages/rider/RiderEarningsPage';

// ─── Auth Pages ─────────────────────────────────────────────────────────────
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// ─── Public Pages ────────────────────────────────────────────────────────────
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';

// ─── Toast Notification ─────────────────────────────────────────────────────
const ToastContainer = () => {
  const { toastMessage } = useApp();
  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isWarning = toastMessage.type === 'warning';
  const isError   = toastMessage.type === 'error';

  const iconName = isSuccess ? 'tick-circle' : isWarning ? 'warning' : isError ? 'close-circle' : 'info-circle';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-200 pointer-events-none">
      <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-[13px] font-bold text-white pointer-events-auto max-w-sm ${
        isSuccess ? 'bg-[#079B48] shadow-[#079B48]/30' :
        isWarning ? 'bg-[#F28C00] shadow-[#F28C00]/30' :
        isError   ? 'bg-[#D95353] shadow-[#D95353]/30' :
        'bg-[#171917] dark:bg-[#202922]'
      }`}>
        <IconsaxIcon name={iconName} size={18} color="white" />
        <span>{toastMessage.message}</span>
      </div>
    </div>
  );
};

// ─── Shared Loading Screen ────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-[#079B48] border-t-transparent rounded-full animate-spin" />
      <p className="text-[13px] font-bold text-[#777D79] dark:text-[#8E9A92]">Verifying credentials...</p>
    </div>
  </div>
);

// ─── Root redirect: landing page for guests, portal for logged-in users ───────
const RootRedirect = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#079B48] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-bold text-[#777D79]">Loading SMILE FOOD...</p>
        </div>
      </div>
    );
  }

  // If not logged in → show the public landing page
  if (!user) return <LandingPage />;

  // If logged in → go to role portal
  const rolePortalMap = {
    [ROLES.ADMIN]:    '/admin',
    [ROLES.CUSTOMER]: '/customer',
    [ROLES.VENDOR]:   '/vendor',
    [ROLES.RIDER]:    '/rider',
  };

  return <Navigate to={rolePortalMap[userRole] || '/customer'} replace />;
};

// ─── Protected Role Guard ────────────────────────────────────────────────────
const RoleGuard = ({ allowedRole, roleTitle, children }) => {
  const { user, userRole, loading } = useAuth();
  const { showToast } = useApp();

  useEffect(() => {
    if (!loading && user && userRole !== allowedRole) {
      showToast(`Access Denied: You do not have permission to access the ${roleTitle} portal.`, 'error');
    }
  }, [loading, user, userRole, allowedRole, roleTitle, showToast]);

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to={`/login?returnUrl=/${allowedRole}`} replace />;

  if (userRole !== allowedRole) {
    const rolePortalMap = {
      [ROLES.ADMIN]:    '/admin',
      [ROLES.CUSTOMER]: '/customer',
      [ROLES.VENDOR]:   '/vendor',
      [ROLES.RIDER]:    '/rider',
    };
    return <Navigate to={rolePortalMap[userRole] || '/customer'} replace />;
  }

  return children;
};

// ─── Admin Portal Layout ─────────────────────────────────────────────────────
const AdminLayout = () => (
  <RoleGuard allowedRole={ROLES.ADMIN} roleTitle="Administrator Operations">
    <div className="flex min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] transition-colors">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 sm:p-8 lg:p-9 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <OrderDetailModal />
      <LedgerAuditModal />
    </div>
  </RoleGuard>
);

// ─── Customer Portal Layout ───────────────────────────────────────────────────
const CustomerHeader = () => {
  const { displayName, walletBalance } = useAuth();
  return (
    <div className="h-16 bg-white dark:bg-[#181F1A] border-b border-[#EEEEEE] dark:border-[#27332A] flex items-center justify-between px-6 shrink-0">
      <p className="text-[14px] font-bold text-[#777D79] dark:text-[#8E9A92]">Customer Marketplace</p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] text-[13px] font-bold text-[#079B48]">
          <IconsaxIcon name="wallet" size={15} color="#079B48" />
          <span>₦{((walletBalance || 0) * 100).toLocaleString()}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center font-bold text-[#079B48] text-[14px]">
          {displayName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  );
};

const CustomerLayout = () => (
  <RoleGuard allowedRole={ROLES.CUSTOMER} roleTitle="Customer Marketplace">
    <div className="flex min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] transition-colors">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <CustomerHeader />
        <main className="flex-1 p-6 sm:p-8 lg:p-9 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  </RoleGuard>
);

// ─── Vendor Portal Layout ─────────────────────────────────────────────────────
const PortalHeader = ({ accentColor = '#079B48', label = '' }) => {
  const { displayName, walletBalance } = useAuth();
  return (
    <div className="h-16 bg-white dark:bg-[#181F1A] border-b border-[#EEEEEE] dark:border-[#27332A] flex items-center justify-between px-6 shrink-0">
      <p className="text-[14px] font-bold text-[#777D79] dark:text-[#8E9A92]">{label}</p>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold text-white shadow-sm"
          style={{ background: accentColor }}
        >
          <IconsaxIcon name="wallet" size={15} color="white" />
          <span>₦{((walletBalance || 0) * 100).toLocaleString()}</span>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-[14px]"
          style={{ background: accentColor }}
        >
          {displayName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  );
};

const VendorLayout = () => (
  <RoleGuard allowedRole={ROLES.VENDOR} roleTitle="Restaurant Owner / Vendor">
    <div className="flex min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] transition-colors">
      <VendorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader accentColor="#F28C00" label="Vendor Kitchen Portal" />
        <main className="flex-1 p-6 sm:p-8 lg:p-9 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  </RoleGuard>
);

// ─── Rider Portal Layout ──────────────────────────────────────────────────────
const RiderLayout = () => (
  <RoleGuard allowedRole={ROLES.RIDER} roleTitle="Delivery Personnel / Rider">
    <div className="flex min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] transition-colors">
      <RiderSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader accentColor="#079B48" label="Rider Courier Hub" />
        <main className="flex-1 p-6 sm:p-8 lg:p-9 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  </RoleGuard>
);

// ─── Auth Guard: redirect authenticated users away from login/signup ──────────
const AuthGuard = ({ children }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (user) {
    const rolePortalMap = {
      [ROLES.ADMIN]:    '/admin',
      [ROLES.CUSTOMER]: '/customer',
      [ROLES.VENDOR]:   '/vendor',
      [ROLES.RIDER]:    '/rider',
    };
    return <Navigate to={rolePortalMap[userRole] || '/customer'} replace />;
  }

  return children;
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* ── Root: landing for guests, portal redirect for logged-in ── */}
            <Route path="/" element={<RootRedirect />} />

            {/* ── Public Auth Flows ── */}
            <Route path="/login"           element={<AuthGuard><LoginPage /></AuthGuard>} />
            <Route path="/signup"          element={<AuthGuard><SignupPage /></AuthGuard>} />
            <Route path="/forgot-password" element={<AuthGuard><ForgotPasswordPage /></AuthGuard>} />
            <Route path="/reset-password"  element={<ResetPasswordPage />} />

            {/* ── ADMIN PORTAL (/admin/*) ── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index            element={<Overview />} />
              <Route path="orders"    element={<OrdersPage />} />
              <Route path="messages"  element={<MessagesPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="wallet"    element={<WalletPage />} />
              <Route path="profile"   element={<ProfilePage />} />
              <Route path="settings"  element={<SettingsPage />} />
              <Route path="help"      element={<HelpPage />} />
              <Route path="users"     element={<AdminUsersPage />} />
              <Route path="ledger"    element={<AdminLedgerPage />} />
              <Route path="moderation" element={<AdminModerationPage />} />
              <Route path="*"         element={<Navigate to="/admin" replace />} />
            </Route>

            {/* ── CUSTOMER PORTAL (/customer/*) ── */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index            element={<CustomerHomePage />} />
              <Route path="explore"   element={<CustomerExplorePage />} />
              <Route path="orders"    element={<CustomerOrdersPage />} />
              <Route path="cart"      element={<CustomerCartPage />} />
              <Route path="track"     element={<CustomerTrackingPage />} />
              <Route path="tracking"  element={<Navigate to="/customer/track" replace />} />
              <Route path="wallet"    element={<WalletPage />} />
              <Route path="profile"   element={<ProfilePage />} />
              <Route path="settings"  element={<SettingsPage />} />
              <Route path="help"      element={<HelpPage />} />
              <Route path="*"         element={<Navigate to="/customer" replace />} />
            </Route>

            {/* ── VENDOR PORTAL (/vendor/*) ── */}
            <Route path="/vendor" element={<VendorLayout />}>
              <Route index            element={<VendorDashboard />} />
              <Route path="orders"    element={<VendorOrdersPage />} />
              <Route path="menu"      element={<VendorMenuPage />} />
              <Route path="earnings"  element={<VendorEarningsPage />} />
              <Route path="settings"  element={<SettingsPage />} />
              <Route path="profile"   element={<ProfilePage />} />
              <Route path="*"         element={<Navigate to="/vendor" replace />} />
            </Route>

            {/* ── RIDER PORTAL (/rider/*) ── */}
            <Route path="/rider" element={<RiderLayout />}>
              <Route index              element={<RiderDashboard />} />
              <Route path="deliveries"  element={<RiderDeliveriesPage />} />
              <Route path="earnings"    element={<RiderEarningsPage />} />
              <Route path="settings"    element={<SettingsPage />} />
              <Route path="profile"     element={<ProfilePage />} />
              <Route path="*"           element={<Navigate to="/rider" replace />} />
            </Route>

            {/* ── Catch-all 404 ── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <ToastContainer />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

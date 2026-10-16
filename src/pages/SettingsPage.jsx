import React, { useState } from 'react';
import IconsaxIcon from '../components/IconsaxIcon';
import BackButton from '../components/BackButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { darkMode, toggleDarkMode, showToast } = useApp();
  const { user, profile, displayName, updatePassword, signOut, deleteAccount } = useAuth();

  // Active Settings Tab
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'notifications' | 'payments' | 'addresses' | 'security'

  // ─── A. Account Preferences State ───────────────────────────────────────────
  const [preferredLanguage, setPreferredLanguage] = useState(() => localStorage.getItem('smilefood_lang') || 'en');
  const [currency, setCurrency] = useState(() => localStorage.getItem('smilefood_currency') || 'USD');

  const handleSavePreferences = () => {
    localStorage.setItem('smilefood_lang', preferredLanguage);
    localStorage.setItem('smilefood_currency', currency);
    showToast('Account preferences saved successfully!', 'success');
  };

  // ─── B. Notification Settings State ─────────────────────────────────────────
  const [notifSettings, setNotifSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('smilefood_notif_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      orderStatus: true,
      deliveryUpdates: true,
      paymentReceipts: true,
      promotions: false, // Default opt-in off per privacy guidelines
    };
  });

  const toggleNotif = (key) => {
    setNotifSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('smilefood_notif_settings', JSON.stringify(updated));
      return updated;
    });
    showToast('Notification preferences updated.', 'info');
  };

  // ─── C. Saved Payment Methods State (Masked) ────────────────────────────────
  const [paymentMethods, setPaymentMethods] = useState(() => {
    try {
      const saved = localStorage.getItem('smilefood_saved_cards');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'pm-1', brand: 'Mastercard', last4: '4242', expMonth: '12', expYear: '28', isDefault: true },
      { id: 'pm-2', brand: 'Visa', last4: '8821', expMonth: '09', expYear: '27', isDefault: false },
    ];
  });

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardBrand, setNewCardBrand] = useState('Visa');
  const [newCardLast4, setNewCardLast4] = useState('');
  const [newCardExp, setNewCardExp] = useState('12/29');
  const [cardToDelete, setCardToDelete] = useState(null);

  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    if (!newCardLast4 || newCardLast4.length !== 4 || isNaN(newCardLast4)) {
      showToast('Please provide valid 4 digits for the tokenized card.', 'warning');
      return;
    }

    const [expMonth, expYear] = newCardExp.split('/');
    const created = {
      id: `pm-${Date.now()}`,
      brand: newCardBrand,
      last4: newCardLast4,
      expMonth: expMonth || '12',
      expYear: expYear || '29',
      isDefault: paymentMethods.length === 0,
    };

    const updated = [...paymentMethods, created];
    setPaymentMethods(updated);
    localStorage.setItem('smilefood_saved_cards', JSON.stringify(updated));
    setShowAddCardModal(false);
    setNewCardLast4('');
    showToast(`Tokenized ${newCardBrand} (•••• ${newCardLast4}) added securely.`, 'success');
  };

  const handleSetDefaultPayment = (id) => {
    const updated = paymentMethods.map(pm => ({ ...pm, isDefault: pm.id === id }));
    setPaymentMethods(updated);
    localStorage.setItem('smilefood_saved_cards', JSON.stringify(updated));
    showToast('Default payment method updated.', 'success');
  };

  const confirmDeleteCard = () => {
    if (!cardToDelete) return;
    const updated = paymentMethods.filter(pm => pm.id !== cardToDelete.id);
    if (cardToDelete.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setPaymentMethods(updated);
    localStorage.setItem('smilefood_saved_cards', JSON.stringify(updated));
    setCardToDelete(null);
    showToast('Payment method removed successfully.', 'info');
  };

  // ─── D. Address Management State ────────────────────────────────────────────
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('smilefood_saved_addresses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'addr-1', label: 'Primary Residence', street: '14 Adeola Odeku St', area: 'Victoria Island, Lagos', isDefault: true },
      { id: 'addr-2', label: 'Work / Corporate Office', street: 'Plot 82 Admiralty Way', area: 'Lekki Phase 1, Lagos', isDefault: false },
    ];
  });

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState({ label: '', street: '', area: '', isDefault: false });
  const [addressToDelete, setAddressToDelete] = useState(null);

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressFormData({ label: '', street: '', area: '', isDefault: addresses.length === 0 });
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddressId(addr.id);
    setAddressFormData({ label: addr.label, street: addr.street, area: addr.area, isDefault: addr.isDefault });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressFormData.street || !addressFormData.area) {
      showToast('Please provide both street address and city/area.', 'warning');
      return;
    }

    let updated = [];
    if (editingAddressId) {
      updated = addresses.map(a => {
        if (a.id === editingAddressId) {
          return {
            ...a,
            label: addressFormData.label || 'Saved Address',
            street: addressFormData.street.trim(),
            area: addressFormData.area.trim(),
            isDefault: addressFormData.isDefault ? true : a.isDefault,
          };
        }
        return addressFormData.isDefault ? { ...a, isDefault: false } : a;
      });
      showToast('Address updated successfully.', 'success');
    } else {
      const created = {
        id: `addr-${Date.now()}`,
        label: addressFormData.label || 'Saved Address',
        street: addressFormData.street.trim(),
        area: addressFormData.area.trim(),
        isDefault: addressFormData.isDefault || addresses.length === 0,
      };
      updated = addressFormData.isDefault ? addresses.map(a => ({ ...a, isDefault: false })) : [...addresses];
      updated.push(created);
      showToast('New address added successfully.', 'success');
    }

    setAddresses(updated);
    localStorage.setItem('smilefood_saved_addresses', JSON.stringify(updated));
    setAddressModalOpen(false);
  };

  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem('smilefood_saved_addresses', JSON.stringify(updated));
    showToast('Default delivery address updated.', 'success');
  };

  const confirmDeleteAddress = () => {
    if (!addressToDelete) return;
    const updated = addresses.filter(a => a.id !== addressToDelete.id);
    if (addressToDelete.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    localStorage.setItem('smilefood_saved_addresses', JSON.stringify(updated));
    setAddressToDelete(null);
    showToast('Address removed successfully.', 'info');
  };

  // ─── E. Security and Account Access State ───────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    const result = await updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (result.success) {
      showToast('Password successfully changed!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(result.error || 'Failed to update password.', 'error');
    }
  };

  const handleToggle2FA = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    showToast(next ? 'Two-Factor Authentication activated.' : 'Two-Factor Authentication disabled.', 'info');
  };

  const handleConfirmDeleteAccount = async () => {
    await deleteAccount();
    setShowDeleteAccountModal(false);
    showToast('Your account has been deactivated.', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/" label="Dashboard" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
          User Settings & Preferences
        </h2>
        <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
          Manage your account preferences, delivery addresses, payment methods, and security controls
        </p>
      </div>

      {/* Navigation Tabs for Restructured Settings */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-[#181F1A] rounded-2xl border border-[#EEEEEE] dark:border-[#27332A]">
        {[
          { id: 'account', label: 'Preferences', icon: 'setting' },
          { id: 'notifications', label: 'Notifications', icon: 'notification' },
          { id: 'payments', label: 'Payment Methods', icon: 'card' },
          { id: 'addresses', label: 'Saved Addresses', icon: 'location' },
          { id: 'security', label: 'Security & Access', icon: 'lock' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#079B48] text-white shadow-sm'
                : 'text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922]'
            }`}
          >
            <IconsaxIcon name={tab.icon} size={16} color={activeTab === tab.id ? 'white' : '#777D79'} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── SECTION A: ACCOUNT PREFERENCES ─────────────────────────────────── */}
      {activeTab === 'account' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Basic Account Information Card */}
          <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center font-bold text-base">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                  {displayName}
                </h3>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                  {user?.email || 'user@smilefood.com'} · Role: <strong className="text-[#079B48] capitalize">{profile?.role || 'Member'}</strong>
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]">
              Active Profile
            </span>
          </div>

          {/* Theme & Display Mode Card */}
          <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center">
                  <IconsaxIcon name={darkMode ? 'sun' : 'moon'} size={22} color="#079B48" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                    Interface Appearance
                  </h3>
                  <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                    Currently active in <strong className="text-[#079B48]">{darkMode ? 'Dark Mode' : 'Light Mode'}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-toggle-theme"
                onClick={toggleDarkMode}
                className="px-5 py-2.5 rounded-full bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] hover:border-[#079B48] transition-colors"
              >
                Switch to {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          {/* Regional & Language Settings Card */}
          <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-5">
            <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
              Localization & Region
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1.5">
                  Preferred Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                >
                  <option value="en">English (US / International)</option>
                  <option value="fr">Français (French)</option>
                  <option value="yo">Yorùbá</option>
                  <option value="ha">Hausa</option>
                  <option value="ig">Igbo</option>
                  <option value="es">Español (Spanish)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1.5">
                  Display Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                >
                  <option value="USD">USD ($) — US Dollars</option>
                  <option value="NGN">NGN (₦) — Nigerian Naira</option>
                  <option value="EUR">EUR (€) — Euros</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-6 py-2.5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold shadow-sm transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION B: NOTIFICATION SETTINGS ──────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-4 animate-in fade-in">
          <div className="pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
            <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
              Notification & Communication Preferences
            </h3>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
              Choose which operational alerts and transaction receipts you wish to receive
            </p>
          </div>

          {[
            {
              key: 'orderStatus',
              title: 'Order Status Notifications',
              desc: 'Real-time alerts when your order is confirmed, prepared, or ready.',
            },
            {
              key: 'deliveryUpdates',
              title: 'Delivery & Live Courier Pings',
              desc: 'SMS and push tracking alerts when your assigned rider is en route.',
            },
            {
              key: 'paymentReceipts',
              title: 'Payment & Escrow Receipts',
              desc: 'Instant email receipts for payments, escrow holds, and refunds.',
            },
            {
              key: 'promotions',
              title: 'Promotional & Special Partner Offers',
              desc: 'Weekly kitchen discounts and chef specials (Optional opt-in).',
            },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#EEEEEE]/60 dark:border-[#27332A]/60 last:border-b-0">
              <div className="pr-4">
                <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">{item.title}</p>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleNotif(item.key)}
                aria-label={`Toggle ${item.title}`}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                  notifSettings[item.key] ? 'bg-[#079B48]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notifSettings[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ─── SECTION C: SAVED PAYMENT METHODS (MASKED) ──────────────────────── */}
      {activeTab === 'payments' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EEEEEE] dark:border-[#27332A]">
              <div>
                <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                  Saved Payment Cards & Methods
                </h3>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                  Card numbers are tokenized by PCI-DSS compliant providers. Raw CVV/PINs are never retained.
                </p>
              </div>
              <button
                type="button"
                id="btn-add-payment-method"
                onClick={() => setShowAddCardModal(true)}
                className="h-10 px-4 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <IconsaxIcon name="add" size={15} color="white" />
                <span>Add Payment Method</span>
              </button>
            </div>

            {/* List of Masked Saved Cards */}
            <div className="space-y-3">
              {paymentMethods.map(pm => (
                <div
                  key={pm.id}
                  className="p-4 rounded-2xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#FAFAFA] dark:bg-[#141A16] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] flex items-center justify-center font-bold text-[12px] text-[#079B48]">
                      <IconsaxIcon name="card" size={20} color="#079B48" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                          {pm.brand} •••• {pm.last4}
                        </p>
                        {pm.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92]">
                        Expires {pm.expMonth}/{pm.expYear} · Tokenized Vault
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!pm.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultPayment(pm.id)}
                        className="px-3 py-1.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] text-[11px] font-bold text-[#777D79] hover:text-[#079B48] hover:border-[#079B48] transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setCardToDelete(pm)}
                      aria-label="Remove card"
                      className="p-2 text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#331414] rounded-xl transition-colors"
                    >
                      <IconsaxIcon name="trash" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION D: ADDRESS MANAGEMENT ─────────────────────────────────── */}
      {activeTab === 'addresses' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EEEEEE] dark:border-[#27332A]">
              <div>
                <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                  Delivery Destination Addresses
                </h3>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                  Add, edit, or configure default delivery points for fast meal checkout
                </p>
              </div>
              <button
                type="button"
                id="btn-add-address"
                onClick={openAddAddressModal}
                className="h-10 px-4 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <IconsaxIcon name="add" size={15} color="white" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* List of Saved Addresses */}
            <div className="space-y-3">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#FAFAFA] dark:bg-[#141A16] flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center shrink-0 mt-0.5">
                      <IconsaxIcon name="location" size={18} color="#079B48" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                          {addr.label}
                        </p>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] font-medium text-[#171917] dark:text-[#F0F5F2] mt-0.5">
                        {addr.street}
                      </p>
                      <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92]">
                        {addr.area}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="px-3 py-1.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] text-[11px] font-bold text-[#777D79] hover:text-[#079B48] hover:border-[#079B48] transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEditAddressModal(addr)}
                      className="px-3 py-1.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] text-[11px] font-bold text-[#171917] dark:text-[#F0F5F2] hover:border-[#079B48] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressToDelete(addr)}
                      aria-label="Delete address"
                      className="p-2 text-[#D95353] hover:bg-[#FDECEC] dark:hover:bg-[#331414] rounded-xl transition-colors"
                    >
                      <IconsaxIcon name="trash" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION E: SECURITY AND ACCOUNT ACCESS ────────────────────────── */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-5">
            <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
              Change Account Password
            </h3>

            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
                  New Password (min. 8 characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword || !newPassword}
                className="px-6 py-2.5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isUpdatingPassword ? 'Updating Password...' : 'Save New Password'}
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication & Session Card */}
          <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-4">
            <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
              Account Authentication Security
            </h3>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                  Two-Factor Authentication (2FA)
                </p>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                  Enforce secondary confirmation via authenticator app or SMS code
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggle2FA}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                  twoFactorEnabled ? 'bg-[#079B48]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="pt-3 border-t border-[#EEEEEE] dark:border-[#27332A] flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2]">
                  Active Session
                </p>
                <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                  Signed in as <strong>{user?.email || 'user@smilefood.com'}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="px-4 py-2 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] hover:border-[#D95353] text-[#D95353] text-[12px] font-bold transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="p-6 bg-[#FDECEC]/40 dark:bg-[#331414]/30 border border-[#D95353]/30 rounded-[32px] space-y-3">
            <h4 className="text-[15px] font-bold text-[#D95353]">
              Danger Zone: Account Deactivation
            </h4>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
              Permanently close your SMILE FOOD account, revoke stored credentials, and cancel active sessions.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteAccountModal(true)}
              className="px-5 py-2 rounded-xl bg-[#D95353] hover:bg-red-700 text-white text-[12px] font-bold transition-all"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add Payment Method ───────────────────────────────────────── */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
              <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                Add Tokenized Card
              </h3>
              <button onClick={() => setShowAddCardModal(false)} aria-label="Close" className="text-[#777D79]">
                <IconsaxIcon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleAddPaymentMethod} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Card Brand</label>
                <select
                  value={newCardBrand}
                  onChange={(e) => setNewCardBrand(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Verve">Verve</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Last 4 Digits</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={newCardLast4}
                  onChange={(e) => setNewCardLast4(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 5521"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Expiration (MM/YY)</label>
                <input
                  type="text"
                  value={newCardExp}
                  onChange={(e) => setNewCardExp(e.target.value)}
                  placeholder="12/28"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#777D79]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#079B48] text-white text-[12px] font-bold shadow-sm"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Delete Card Confirmation ─────────────────────────────────── */}
      {cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 shadow-2xl space-y-4">
            <h3 className="text-[17px] font-bold text-[#D95353] font-['Outfit']">
              Remove Payment Method?
            </h3>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
              Are you sure you want to remove <strong>{cardToDelete.brand} •••• {cardToDelete.last4}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCardToDelete(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#777D79]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCard}
                className="px-5 py-2 rounded-xl bg-[#D95353] text-white text-[12px] font-bold shadow-sm"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add / Edit Address ───────────────────────────────────────── */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
              <h3 className="text-[18px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={() => setAddressModalOpen(false)} aria-label="Close" className="text-[#777D79]">
                <IconsaxIcon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
                  Address Label (e.g. Home, Office, Gym)
                </label>
                <input
                  type="text"
                  value={addressFormData.label}
                  onChange={(e) => setAddressFormData({ ...addressFormData, label: e.target.value })}
                  placeholder="e.g. Beach House"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={addressFormData.street}
                  onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                  placeholder="e.g. 25 Bishop Oluwole St"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
                  City / Area
                </label>
                <input
                  type="text"
                  required
                  value={addressFormData.area}
                  onChange={(e) => setAddressFormData({ ...addressFormData, area: e.target.value })}
                  placeholder="e.g. Victoria Island, Lagos"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-default-address"
                  checked={addressFormData.isDefault}
                  onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                  className="rounded border-[#EEEEEE] text-[#079B48] focus:ring-[#079B48]"
                />
                <label htmlFor="chk-default-address" className="text-[12px] font-semibold text-[#171917] dark:text-[#F0F5F2]">
                  Set as default delivery destination
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#777D79]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#079B48] text-white text-[12px] font-bold shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Delete Address Confirmation ──────────────────────────────── */}
      {addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 shadow-2xl space-y-4">
            <h3 className="text-[17px] font-bold text-[#D95353] font-['Outfit']">
              Delete Delivery Address?
            </h3>
            <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
              Are you sure you want to remove <strong>{addressToDelete.label}</strong> ({addressToDelete.street})?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#777D79]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAddress}
                className="px-5 py-2 rounded-xl bg-[#D95353] text-white text-[12px] font-bold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Deactivate Account Confirmation ─────────────────────────── */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-[#D95353] flex items-center justify-center mx-auto">
              <IconsaxIcon name="warning" size={24} color="#D95353" />
            </div>
            <h3 className="text-[18px] font-bold text-center text-[#D95353] font-['Outfit']">
              Confirm Account Deactivation
            </h3>
            <p className="text-[13px] text-center text-[#777D79] dark:text-[#8E9A92]">
              This will permanently revoke your credentials, sign you out of all sessions, and deactivate your SMILE FOOD profile. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(false)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#777D79]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                className="px-5 py-2 rounded-xl bg-[#D95353] hover:bg-red-700 text-white text-[12px] font-bold shadow-sm"
              >
                Deactivate Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

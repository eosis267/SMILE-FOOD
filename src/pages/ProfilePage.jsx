import React, { useState } from 'react';
import IconsaxIcon from '../components/IconsaxIcon';
import BackButton from '../components/BackButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { showToast } = useApp();
  const { displayName, user, profile, userRole } = useAuth();

  const [formData, setFormData] = useState({
    fullName: displayName || "Mike Adeleke",
    email: user?.email || "mike.ops@smilefood.com",
    phone: "+1 (555) 782-9011",
    role: userRole ? userRole.toUpperCase() : "Lead Operations & Escrow Architect",
    bankName: "Chase Commercial Banking",
    accountNumber: "•••• •••• •••• 9281",
    swiftCode: "CHASUS33XXX",
    twoFactorEnabled: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Profile information successfully updated!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BackButton fallbackTo="/" label="Dashboard" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
          Administrator & Operations Profile
        </h2>
        <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
          Manage security clearance, payout escrow routing, and identity credentials
        </p>
      </div>

      {/* Profile Card Header */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces"
            alt="Mike Adeleke"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-[#079B48]/30 shadow-md"
          />
          <button 
            onClick={() => showToast('Avatar upload simulated!', 'info')}
            aria-label="Upload Avatar"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#079B48] text-white flex items-center justify-center text-xs shadow-md hover:scale-105 transition-transform"
          >
            <IconsaxIcon name="edit" size={14} color="#FFFFFF" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h3 className="text-[22px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
              {formData.fullName}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A] flex items-center gap-1">
              <IconsaxIcon name="shield-check" size={13} color="#079B48" />
              Verified Operations Lead
            </span>
          </div>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            {formData.role} • Station Central Hub 01
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-[12px] font-semibold text-[#777D79] dark:text-[#8E9A92]">
            <span>Active Since: Oct 2023</span>
            <span>•</span>
            <span>Escrow Clearance: Tier 1 (Unlimited)</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="smile-card p-6 sm:p-8 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-6">
        <h4 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
          Personal Credentials
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-1.5">
              Work Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-1.5">
              Emergency Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-1.5">
              Role & Title
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            />
          </div>
        </div>

        <h4 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pt-4 pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
          Platform Settlement & Payout Routing
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-1.5">
              Primary Settlement Bank
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-1.5">
              Account Number
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] mb-1.5">
              SWIFT / BIC Code
            </label>
            <input
              type="text"
              value={formData.swiftCode}
              onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/25"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;

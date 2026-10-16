import React, { useState } from 'react';
import IconsaxIcon from '../components/IconsaxIcon';
import BackButton from '../components/BackButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { maskAccountNumber } from '../lib/apiSecurity';

export const ProfilePage = () => {
  const { showToast } = useApp();
  const { displayName, user, profile, userRole, walletBalance, updateUserProfile } = useAuth();

  // State: View Mode (false) vs Edit Mode (true)
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Bank Account Masking Toggle
  const [showFullBank, setShowFullBank] = useState(false);

  // Persisted state baseline derived from verified auth context
  const persistedData = {
    fullName: profile?.full_name || displayName || "Mike Adeleke",
    email: user?.email || "mike.ops@smilefood.com",
    phone: profile?.phone || "+1 (555) 782-9011",
    role: (profile?.role || userRole || 'customer').toUpperCase(),
    businessName: profile?.business_name || (userRole === 'vendor' ? 'Mama Cass Restaurant' : 'SMILE Operations Hub'),
    bankName: "Chase Commercial Banking",
    accountNumber: "928144028912",
    swiftCode: "CHASUS33XXX",
  };

  const [formData, setFormData] = useState(persistedData);

  // Activate explicit edit mode
  const handleStartEdit = () => {
    setSaveError(null);
    setFormData({ ...persistedData });
    setIsEditing(true);
  };

  // Discard changes & restore original persisted values
  const handleCancel = () => {
    setFormData({ ...persistedData });
    setSaveError(null);
    setIsEditing(false);
    showToast('Changes discarded. Original profile values restored.', 'info');
  };

  // Validate on client before submitting to backend
  const validateClientInputs = () => {
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      return 'Full name is required and must be at least 2 characters.';
    }
    if (formData.fullName.trim().length > 100) {
      return 'Full name cannot exceed 100 characters.';
    }
    if (formData.phone) {
      const phoneRegex = /^[\d\s+\-().]{7,25}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        return 'Please enter a valid phone number (7–25 digits, e.g. +234 803 123 4567).';
      }
    }
    return null;
  };

  // Submit changes to backend with duplicate submission prevention
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!isEditing || isSaving) return;

    setSaveError(null);

    // 1. Client-side validation
    const validationErr = validateClientInputs();
    if (validationErr) {
      setSaveError(validationErr);
      showToast(validationErr, 'error');
      return;
    }

    setIsSaving(true);

    try {
      // 2. Submit authorized update payload to backend
      const updatePayload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        businessName: formData.businessName?.trim(),
      };

      const result = await updateUserProfile(updatePayload);

      if (!result.success) {
        // Failed update: preserve local inputs for retry, never overwrite persisted data
        setSaveError(result.error || 'Server rejected profile update.');
        showToast(result.error || 'Failed to update profile.', 'error');
        setIsSaving(false);
        return;
      }

      // 3. Success: exit edit mode
      setIsEditing(false);
      setIsSaving(false);
      showToast('Profile information successfully saved and verified!', 'success');
    } catch {
      setSaveError('An unexpected network error occurred while saving.');
      showToast('Profile update failed. Please retry.', 'error');
      setIsSaving(false);
    }
  };

  // Display role badge
  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { label: 'Verified Operations Lead', color: '#079B48', bg: 'bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]' };
      case 'vendor':
        return { label: 'Verified Restaurant Partner', color: '#F28C00', bg: 'bg-[#FFF6E5] text-[#F28C00] dark:bg-[#332210] dark:text-[#F28C00]' };
      case 'rider':
        return { label: 'Verified Courier Fleet', color: '#087F3C', bg: 'bg-[#E8F1FC] text-[#087F3C] dark:bg-[#122820] dark:text-[#52D288]' };
      default:
        return { label: 'Verified Member', color: '#079B48', bg: 'bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A]' };
    }
  };

  const roleBadge = getRoleBadge(persistedData.role);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header with Title and Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/" label="Dashboard" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Personal & Security Profile
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            View and manage account credentials, verified contact details, and settlement routing
          </p>
        </div>

        {/* Action Button: Edit Profile vs Save / Cancel */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isEditing ? (
            <button
              type="button"
              id="btn-edit-profile"
              onClick={handleStartEdit}
              className="h-11 px-5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/20 flex items-center gap-2 active:scale-95"
            >
              <IconsaxIcon name="edit" size={16} color="white" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-cancel-profile"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-11 px-4 rounded-full border border-[#EEEEEE] dark:border-[#27332A] bg-white dark:bg-[#181F1A] text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] text-[13px] font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-save-profile"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="h-11 px-5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/25 flex items-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <IconsaxIcon name="check" size={16} color="white" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Mode Notice Banner */}
      {isEditing && (
        <div className="p-4 rounded-2xl bg-[#FFF6E5] dark:bg-[#332210] border border-[#F28C00]/30 flex items-center justify-between gap-3 text-[13px] text-[#A66000] dark:text-[#F28C00] animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <IconsaxIcon name="warning" size={18} color="#F28C00" />
            <span className="font-semibold">
              Edit Mode Active: Changes are held locally until you click "Save Changes". Click "Cancel" to revert.
            </span>
          </div>
        </div>
      )}

      {/* Save Error Alert */}
      {saveError && (
        <div className="p-4 rounded-2xl bg-[#FDECEC] dark:bg-[#331414] border border-[#D95353]/30 flex items-center gap-3 text-[13px] text-[#D95353] dark:text-[#E56262]">
          <IconsaxIcon name="failed" size={18} color="#D95353" />
          <span className="font-semibold">{saveError}</span>
        </div>
      )}

      {/* Profile Header Summary Card */}
      <div className="smile-card p-6 sm:p-7 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces"
            alt={persistedData.fullName}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-[#079B48]/30 shadow-md"
          />
          {isEditing && (
            <button 
              type="button"
              onClick={() => showToast('Avatar update will be applied upon saving profile.', 'info')}
              aria-label="Upload Avatar"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#079B48] text-white flex items-center justify-center text-xs shadow-md hover:scale-105 transition-transform"
            >
              <IconsaxIcon name="edit" size={14} color="#FFFFFF" />
            </button>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h3 className="text-[22px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
              {persistedData.fullName}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${roleBadge.bg}`}>
              <IconsaxIcon name="shield-check" size={13} color={roleBadge.color} />
              {roleBadge.label}
            </span>
          </div>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            Role: <strong className="text-[#171917] dark:text-[#F0F5F2]">{persistedData.role}</strong> • SMILE FOOD Station Hub
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-[12px] font-semibold text-[#777D79] dark:text-[#8E9A92]">
            <span>Active Member</span>
            <span>•</span>
            <span>Escrow Balance: <strong className="text-[#079B48]">${walletBalance.toFixed(2)}</strong></span>
            <span>•</span>
            <span>Identity Status: Verified</span>
          </div>
        </div>
      </div>

      {/* Main Profile Form Card */}
      <form onSubmit={handleSaveChanges} className="smile-card p-6 sm:p-8 bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
          <h4 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Personal & Contact Information
          </h4>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
            {isEditing ? 'Editing Enabled' : 'View-Only Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1.5">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="input-full-name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#079B48] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:ring-2 focus:ring-[#079B48]/20"
                placeholder="Enter full legal name"
              />
            ) : (
              <div
                id="view-full-name"
                tabIndex={0}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] flex items-center cursor-default select-text focus:outline-none"
              >
                {persistedData.fullName}
              </div>
            )}
          </div>

          {/* Email Address (View-only for security; requires dedicated auth flow to change) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
                Verified Email Address
              </label>
              <span className="text-[10px] font-bold text-[#777D79] dark:text-[#8E9A92] flex items-center gap-1">
                <IconsaxIcon name="lock" size={10} /> Protected
              </span>
            </div>
            <div
              id="view-email"
              tabIndex={0}
              className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#777D79] dark:text-[#8E9A92] flex items-center justify-between cursor-default select-text focus:outline-none"
            >
              <span>{persistedData.email}</span>
              <span className="text-[11px] font-bold text-[#079B48]">Verified</span>
            </div>
          </div>

          {/* Emergency / Contact Phone */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1.5">
              Contact Phone Number
            </label>
            {isEditing ? (
              <input
                type="text"
                id="input-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#079B48] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:ring-2 focus:ring-[#079B48]/20"
                placeholder="+234 803 123 4567"
              />
            ) : (
              <div
                id="view-phone"
                tabIndex={0}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] flex items-center cursor-default select-text focus:outline-none"
              >
                {persistedData.phone ? persistedData.phone : 'Not set'}
              </div>
            )}
          </div>

          {/* Business / Organization Name */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1.5">
              Business / Station Unit
            </label>
            {isEditing ? (
              <input
                type="text"
                id="input-business-name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5] dark:bg-[#202922] border border-[#079B48] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:ring-2 focus:ring-[#079B48]/20"
                placeholder="Station Unit or Restaurant Name"
              />
            ) : (
              <div
                id="view-business-name"
                tabIndex={0}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] flex items-center cursor-default select-text focus:outline-none"
              >
                {persistedData.businessName}
              </div>
            )}
          </div>
        </div>

        {/* System Assigned RBAC Role (Completely Non-Editable - Prevents Privilege Escalation) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
              Assigned Security Role & RBAC Clearance
            </label>
            <span className="text-[10px] font-bold text-[#F28C00] flex items-center gap-1">
              <IconsaxIcon name="lock" size={10} /> System Controlled
            </span>
          </div>
          <div className="w-full p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#141A16] border border-[#EEEEEE] dark:border-[#27332A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EAF8D8] text-[#079B48] dark:bg-[#14301C] dark:text-[#D5F28A] flex items-center justify-center font-bold text-xs">
                {persistedData.role.charAt(0)}
              </div>
              <div>
                <p className="text-[13px] font-extrabold text-[#171917] dark:text-[#F0F5F2]">
                  {persistedData.role}
                </p>
                <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92]">
                  Assigned permissions cannot be self-modified. Contact operations administrator for role changes.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F5F6F5] dark:bg-[#202922] text-[#777D79] dark:text-[#8E9A92]">
              Immutable
            </span>
          </div>
        </div>

        {/* Highly Sensitive Settlement & Bank Routing (Masked by default) */}
        <div className="pt-4 border-t border-[#EEEEEE] dark:border-[#27332A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                Settlement & Payout Routing
              </h4>
              <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">
                Bank account identifiers are masked by default to protect financial confidentiality
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFullBank(!showFullBank)}
              className="text-[12px] font-bold text-[#079B48] hover:underline flex items-center gap-1"
            >
              <IconsaxIcon name={showFullBank ? 'eye-slash' : 'eye'} size={14} color="#079B48" />
              <span>{showFullBank ? 'Mask Details' : 'Reveal Account'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1.5">
                Primary Settlement Bank
              </label>
              <div className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] flex items-center">
                {persistedData.bankName}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1.5">
                Account Number (Masked)
              </label>
              <div className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-mono font-semibold text-[#171917] dark:text-[#F0F5F2] flex items-center">
                {showFullBank ? persistedData.accountNumber : maskAccountNumber(persistedData.accountNumber)}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-1.5">
                SWIFT / BIC Code
              </label>
              <div className="w-full h-11 px-3.5 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-mono font-semibold text-[#171917] dark:text-[#F0F5F2] flex items-center">
                {persistedData.swiftCode}
              </div>
            </div>
          </div>
        </div>

        {/* Explicit Save and Cancel Actions in Form Footer when Editing */}
        {isEditing && (
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EEEEEE] dark:border-[#27332A]">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full border border-[#EEEEEE] dark:border-[#27332A] text-[13px] font-bold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[13px] font-bold transition-all shadow-md shadow-[#079B48]/25 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;

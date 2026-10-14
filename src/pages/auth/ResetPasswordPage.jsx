import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import IconsaxIcon from '../../components/IconsaxIcon';

const ResetPasswordPage = () => {
  const { updatePassword, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Too short', color: '#D95353', width: '25%' };
    if (password.length < 8) return { label: 'Weak', color: '#F28C00', width: '50%' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Fair', color: '#E6B83E', width: '75%' };
    return { label: 'Strong', color: '#149B57', width: '100%' };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    if (!password || !confirmPassword) { setLocalError('Please fill in both fields.'); return; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }

    setIsSubmitting(true);
    const result = await updatePassword(password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } else {
      setLocalError(result.error || 'Password update failed. Your reset link may have expired.');
    }
  };

  const error = localError || authError;

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F6F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] border border-[#EEEEEE] shadow-xl p-10 text-center max-w-[400px] w-full animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-[#EAF8D8] flex items-center justify-center mx-auto mb-5">
            <IconsaxIcon name="shield-check" size={32} color="#079B48" />
          </div>
          <h2 className="text-[22px] font-extrabold text-[#171917] font-['Outfit'] mb-2">Password updated!</h2>
          <p className="text-[14px] text-[#777D79] mb-6">
            Your password has been changed securely. Redirecting you to login...
          </p>
          <Link to="/login" className="inline-flex h-[46px] px-8 items-center justify-center rounded-[30px] bg-[#014C32] text-white text-[14px] font-bold hover:bg-[#038B5C] transition-colors">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F5] flex items-center justify-center p-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#079B48]/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#079B48] flex items-center justify-center shadow-lg shadow-[#079B48]/25">
            <IconsaxIcon name="brand-smile" size={26} color="white" />
          </div>
          <span className="font-extrabold text-[22px] tracking-tight text-[#079B48] font-['Outfit']">SMILE FOOD</span>
        </Link>

        <div className="bg-white rounded-[32px] border border-[#EEEEEE] shadow-xl shadow-black/5 p-8">
          <div className="mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8D8] flex items-center justify-center mb-4">
              <IconsaxIcon name="shield-check" size={24} color="#079B48" />
            </div>
            <h1 className="text-[24px] font-extrabold text-[#171917] font-['Outfit']">Set new password</h1>
            <p className="text-[13px] text-[#777D79] mt-1.5">
              Create a strong new password for your account.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#FDECEC] border border-[#D95353]/20 flex items-center gap-2.5 text-[13px] font-semibold text-[#D95353]">
              <IconsaxIcon name="failed" size={16} color="#D95353" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-[#171917] mb-1.5">New Password</label>
              <div className="relative">
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters with uppercase & number"
                  autoFocus
                  className="w-full h-[52px] px-4 pr-12 rounded-[12px] border border-[#EEEEEE] bg-[#F5F6F5] text-[14px] font-medium text-[#171917] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:bg-white focus:ring-2 focus:ring-[#079B48]/12 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777D79] hover:text-[#171917] transition-colors">
                  <IconsaxIcon name={showPassword ? "eye" : "eye-slash"} size={18} />
                </button>
              </div>
              {passwordStrength && (
                <div className="mt-2">
                  <div className="h-1 bg-[#EEEEEE] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }} />
                  </div>
                  <p className="text-[11px] font-semibold mt-1" style={{ color: passwordStrength.color }}>{passwordStrength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#171917] mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  id="reset-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`w-full h-[52px] px-4 pr-12 rounded-[12px] border bg-[#F5F6F5] text-[14px] font-medium text-[#171917] placeholder-[#AAAAAA] focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-[#D95353] focus:border-[#D95353] focus:ring-[#D95353]/12'
                      : 'border-[#EEEEEE] focus:border-[#079B48] focus:ring-[#079B48]/12'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777D79] hover:text-[#171917] transition-colors">
                  <IconsaxIcon name={showConfirm ? "eye" : "eye-slash"} size={18} />
                </button>
              </div>
            </div>

            <button
              id="reset-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[48px] rounded-[30px] bg-[#014C32] hover:bg-[#038B5C] text-white text-[15px] font-bold transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-[#014C32]/20 mt-1"
            >
              {isSubmitting ? (
                <>
                  <IconsaxIcon name="loading" size={16} color="white" />
                  Updating...
                </>
              ) : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

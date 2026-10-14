import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import IconsaxIcon from '../../components/IconsaxIcon';

const ForgotPasswordPage = () => {
  const { resetPassword, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);
    if (!email) { setLocalError('Please enter your email address.'); return; }

    setIsSubmitting(true);
    const result = await resetPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setLocalError(result.error || 'Reset request failed. Please try again.');
    }
  };

  const error = localError || authError;

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-[#181F1A] rounded-[32px] border border-[#EEEEEE] dark:border-[#27332A] shadow-xl p-10 text-center max-w-[420px] w-full animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center mx-auto mb-5">
            <IconsaxIcon name="mail" size={30} color="#079B48" />
          </div>
          <h2 className="text-[22px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-2">Email sent!</h2>
          <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] leading-relaxed mb-6">
            We sent a password reset link to <strong className="text-[#171917] dark:text-[#F0F5F2]">{email}</strong>.
            Check your inbox and follow the instructions.
          </p>
          <div className="p-3.5 rounded-2xl bg-[#EAF8D8] dark:bg-[#14301C] text-[12px] font-semibold text-[#079B48] dark:text-[#D5F28A] mb-6 flex items-center gap-2 text-left">
            <IconsaxIcon name="info" size={16} color="#079B48" />
            <span>Tip: Also check your spam/junk folder if you don't see it within a minute.</span>
          </div>
          <Link
            to="/login"
            className="inline-flex h-[46px] px-8 items-center justify-center rounded-[30px] bg-[#014C32] text-white text-[14px] font-bold hover:bg-[#038B5C] transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#079B48]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#079B48] flex items-center justify-center shadow-lg shadow-[#079B48]/25">
            <IconsaxIcon name="brand-smile" size={26} color="white" />
          </div>
          <span className="font-extrabold text-[22px] tracking-tight text-[#079B48] font-['Outfit']">SMILE FOOD</span>
        </Link>

        <div className="bg-white dark:bg-[#181F1A] rounded-[32px] border border-[#EEEEEE] dark:border-[#27332A] shadow-xl shadow-black/5 dark:shadow-black/20 p-8 transition-colors">
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#777D79] dark:text-[#8E9A92] hover:text-[#171917] dark:hover:text-white transition-colors mb-6"
          >
            <IconsaxIcon name="arrow-left" size={16} />
            Back to Login
          </Link>

          <div className="mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center mb-4">
              <IconsaxIcon name="shield-check" size={24} color="#079B48" />
            </div>
            <h1 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">Forgot password?</h1>
            <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92] mt-1.5 leading-relaxed">
              No worries! Enter your account email and we'll send you a secure reset link.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#FDECEC] dark:bg-[#3D1414] border border-[#D95353]/20 flex items-center gap-2.5 text-[13px] font-semibold text-[#D95353]">
              <IconsaxIcon name="close-circle" size={16} color="#D95353" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">Email address</label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your account email"
                autoFocus
                className="w-full h-[52px] px-4 rounded-[14px] border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[14px] font-medium text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:bg-white dark:focus:bg-[#181F1A] focus:ring-2 focus:ring-[#079B48]/12 transition-all"
              />
            </div>

            <button
              id="forgot-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[48px] rounded-[30px] bg-[#014C32] hover:bg-[#038B5C] text-white text-[15px] font-bold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#014C32]/20"
            >
              {isSubmitting ? (
                <>
                  <IconsaxIcon name="loading" size={16} color="white" />
                  <span>Sending link...</span>
                </>
              ) : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-[#777D79] dark:text-[#8E9A92] mt-6">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-[#079B48] hover:text-[#087F3C] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

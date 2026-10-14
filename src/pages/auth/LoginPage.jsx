import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import IconsaxIcon from '../../components/IconsaxIcon';

const LoginPage = () => {
  const { signIn, signInWithGoogle, demoSignIn, authError, setAuthError, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // Get return URL from query params (set by silent refresh interceptor)
  const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);
    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
    const result = await signIn({ email, password });
    setIsSubmitting(false);
    if (result.success) {
      navigate(returnUrl, { replace: true });
    } else {
      setLocalError(result.error || 'Sign in failed. Please try again.');
    }
  };

  const handleDemoLogin = (role) => {
    setIsSubmitting(true);
    const result = demoSignIn(role);
    setIsSubmitting(false);
    if (result.success) navigate('/', { replace: true });
  };

  const handleGoogle = async () => {
    const result = await signInWithGoogle();
    if (!result.success) setLocalError(result.error || 'Google sign-in failed.');
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center p-4 transition-colors">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#079B48]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#079B48] flex items-center justify-center shadow-lg shadow-[#079B48]/25">
            <IconsaxIcon name="brand-smile" size={26} color="white" />
          </div>
          <span className="font-extrabold text-[22px] tracking-tight text-[#079B48] font-['Outfit']">SMILE FOOD</span>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-[#181F1A] rounded-[32px] border border-[#EEEEEE] dark:border-[#27332A] shadow-xl shadow-black/5 dark:shadow-black/20 p-8 transition-colors">
          <div className="mb-7">
            <h1 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] tracking-tight">
              Welcome back
            </h1>
            <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mt-1">
              Sign in to your authorized SMILE FOOD portal
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#FDECEC] dark:bg-[#3D1414] border border-[#D95353]/20 flex items-center gap-2.5 text-[13px] font-semibold text-[#D95353]">
              <IconsaxIcon name="close-circle" size={16} color="#D95353" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            className="w-full h-[48px] flex items-center justify-center gap-3 border border-[#EEEEEE] dark:border-[#27332A] rounded-[30px] text-[14px] font-semibold text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors mb-5"
          >
            <IconsaxIcon name="google" size={18} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#EEEEEE] dark:bg-[#27332A]" />
            <span className="text-[12px] font-bold text-[#777D79] dark:text-[#8E9A92] uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-[#EEEEEE] dark:bg-[#27332A]" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mike@smilefood.com"
                autoComplete="email"
                className="w-full h-[52px] px-4 rounded-[14px] border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[14px] font-medium text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:bg-white dark:focus:bg-[#181F1A] focus:ring-2 focus:ring-[#079B48]/12 transition-all"
              />
            </div>

            {/* Password with visibility toggle */}
            <div>
              <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full h-[52px] px-4 pr-12 rounded-[14px] border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[14px] font-medium text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:bg-white dark:focus:bg-[#181F1A] focus:ring-2 focus:ring-[#079B48]/12 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777D79] hover:text-[#171917] dark:hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <IconsaxIcon name={showPassword ? "eye" : "eye-slash"} size={18} />
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-[12px] font-semibold text-[#079B48] hover:text-[#087F3C] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full h-[48px] rounded-[30px] bg-[#014C32] hover:bg-[#038B5C] text-white text-[15px] font-bold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2 shadow-md shadow-[#014C32]/20"
            >
              {isSubmitting ? (
                <>
                  <IconsaxIcon name="loading" size={16} color="white" />
                  <span>Signing in...</span>
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Role-Specific Verified Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[#EEEEEE] dark:border-[#27332A]">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92] mb-2.5 text-center">
              Quick Verified Demo Accounts (RBAC)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="h-[38px] px-2.5 rounded-xl bg-[#EAF8D8] dark:bg-[#14301C] text-[#079B48] dark:text-[#D5F28A] text-[12px] font-bold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <IconsaxIcon name="security-safe" size={15} color="#079B48" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="h-[38px] px-2.5 rounded-xl bg-[#EAF8D8] dark:bg-[#14301C] text-[#079B48] dark:text-[#D5F28A] text-[12px] font-bold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <IconsaxIcon name="user" size={15} color="#079B48" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('vendor')}
                className="h-[38px] px-2.5 rounded-xl bg-[#FEF5E7] dark:bg-[#2A1F0A] text-[#F28C00] dark:text-[#FFEAAA] text-[12px] font-bold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <IconsaxIcon name="shop" size={15} color="#F28C00" />
                <span>Vendor</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('rider')}
                className="h-[38px] px-2.5 rounded-xl bg-[#F0F8FF] dark:bg-[#102231] text-[#087F3C] dark:text-[#7CD5A9] text-[12px] font-bold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <IconsaxIcon name="scooter" size={15} color="#087F3C" />
                <span>Rider</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] text-[#777D79] dark:text-[#8E9A92] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#079B48] hover:text-[#087F3C] transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

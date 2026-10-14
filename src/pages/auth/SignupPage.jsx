import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import IconsaxIcon from '../../components/IconsaxIcon';

const ROLE_OPTIONS = [
  {
    value: ROLES.CUSTOMER,
    label: 'Customer',
    description: 'Order food for delivery',
    icon: 'user',
    color: '#079B48',
  },
  {
    value: ROLES.VENDOR,
    label: 'Vendor / Restaurant',
    description: 'List your menu and fulfill orders',
    icon: 'shop',
    color: '#F28C00',
  },
  {
    value: ROLES.RIDER,
    label: 'Courier / Rider',
    description: 'Deliver orders and earn',
    icon: 'scooter',
    color: '#087F3C',
  },
];

const SignupPage = () => {
  const { signUp, signInWithGoogle, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-select role from URL query param (e.g. /signup?role=vendor)
  const roleFromUrl = new URLSearchParams(location.search).get('role');
  const validRoles = Object.values(ROLES);
  const initialRole = validRoles.includes(roleFromUrl) ? roleFromUrl : ROLES.CUSTOMER;

  const [step, setStep] = useState(roleFromUrl && validRoles.includes(roleFromUrl) ? 2 : 1);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
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

    if (!fullName.trim() || !email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp({ email, password, fullName, role: selectedRole });
    setIsSubmitting(false);

    if (result.success) {
      if (result.demo) {
        navigate('/', { replace: true });
      } else {
        setSuccess(true);
      }
    } else {
      setLocalError(result.error || 'Sign up failed. Please try again.');
    }
  };

  const error = localError || authError;

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-[#181F1A] rounded-[32px] border border-[#EEEEEE] dark:border-[#27332A] shadow-xl p-10 text-center max-w-[420px] w-full animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] flex items-center justify-center mx-auto mb-5">
            <IconsaxIcon name="check-circle" size={32} color="#079B48" />
          </div>
          <h2 className="text-[22px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] mb-2">Check your email!</h2>
          <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mb-6">
            We sent a confirmation link to <strong className="text-[#171917] dark:text-[#F0F5F2]">{email}</strong>. Click it to activate your account.
          </p>
          <Link to="/login" className="inline-flex h-[46px] px-8 items-center justify-center rounded-[30px] bg-[#014C32] text-white text-[14px] font-bold hover:bg-[#038B5C] transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center p-4 py-10 transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#079B48]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#079B48] flex items-center justify-center shadow-lg shadow-[#079B48]/25">
            <IconsaxIcon name="brand-smile" size={26} color="white" />
          </div>
          <span className="font-extrabold text-[22px] tracking-tight text-[#079B48] font-['Outfit']">SMILE FOOD</span>
        </Link>

        <div className="bg-white dark:bg-[#181F1A] rounded-[32px] border border-[#EEEEEE] dark:border-[#27332A] shadow-xl shadow-black/5 dark:shadow-black/20 p-8 transition-colors">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#079B48]' : 'bg-[#EEEEEE] dark:bg-[#27332A]'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#079B48]' : 'bg-[#EEEEEE] dark:bg-[#27332A]'}`} />
          </div>

          {step === 1 ? (
            <>
              <div className="mb-6">
                <h1 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">Join SMILE FOOD</h1>
                <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92] mt-1">Select your account role</p>
              </div>

              <div className="space-y-3 mb-6">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedRole === role.value
                        ? 'border-[#079B48] bg-[#EAF8D8] dark:bg-[#14301C]'
                        : 'border-[#EEEEEE] dark:border-[#27332A] hover:border-[#D5F28A] hover:bg-[#F5F6F5] dark:hover:bg-[#202922]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#181F1A] flex items-center justify-center shadow-xs">
                      <IconsaxIcon name={role.icon} size={22} color={selectedRole === role.value ? '#079B48' : '#777D79'} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-[14px] font-bold ${selectedRole === role.value ? 'text-[#014C32] dark:text-[#D5F28A]' : 'text-[#171917] dark:text-[#F0F5F2]'}`}>
                        {role.label}
                      </p>
                      <p className="text-[12px] text-[#777D79] dark:text-[#8E9A92]">{role.description}</p>
                    </div>
                    {selectedRole === role.value && (
                      <div className="w-5 h-5 rounded-full bg-[#079B48] flex items-center justify-center">
                        <IconsaxIcon name="check" size={11} color="white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full h-[48px] rounded-[30px] bg-[#014C32] hover:bg-[#038B5C] text-white text-[15px] font-bold transition-all active:scale-[0.98]"
              >
                Continue
              </button>

              {/* Google */}
              <button
                onClick={signInWithGoogle}
                className="w-full mt-3 h-[44px] flex items-center justify-center gap-3 border border-[#EEEEEE] dark:border-[#27332A] rounded-[30px] text-[14px] font-semibold text-[#171917] dark:text-[#F0F5F2] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors"
              >
                <IconsaxIcon name="google" size={16} />
                Sign up with Google
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep(1); setLocalError(''); }}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-[#777D79] dark:text-[#8E9A92] hover:text-[#171917] dark:hover:text-white transition-colors mb-5"
              >
                <IconsaxIcon name="arrow-left" size={16} />
                Back
              </button>

              <div className="mb-6">
                <h1 className="text-[24px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">Create your account</h1>
                <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92] mt-1">
                  Joining as{' '}
                  <span className="font-bold text-[#079B48]">
                    {ROLE_OPTIONS.find(r => r.value === selectedRole)?.label}
                  </span>
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3.5 rounded-2xl bg-[#FDECEC] dark:bg-[#3D1414] border border-[#D95353]/20 flex items-center gap-2.5 text-[13px] font-semibold text-[#D95353]">
                  <IconsaxIcon name="close-circle" size={16} color="#D95353" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Mike Johnson"
                    autoComplete="name"
                    className="w-full h-[52px] px-4 rounded-[14px] border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[14px] font-medium text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:bg-white dark:focus:bg-[#181F1A] focus:ring-2 focus:ring-[#079B48]/12 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">Email address</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mike@smilefood.com"
                    autoComplete="email"
                    className="w-full h-[52px] px-4 rounded-[14px] border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[14px] font-medium text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:bg-white dark:focus:bg-[#181F1A] focus:ring-2 focus:ring-[#079B48]/12 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      className="w-full h-[52px] px-4 pr-12 rounded-[14px] border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[14px] font-medium text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:border-[#079B48] focus:bg-white dark:focus:bg-[#181F1A] focus:ring-2 focus:ring-[#079B48]/12 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777D79] hover:text-[#171917] dark:hover:text-white transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      <IconsaxIcon name={showPassword ? "eye" : "eye-slash"} size={18} />
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {passwordStrength && (
                    <div className="mt-2">
                      <div className="h-1 bg-[#EEEEEE] dark:bg-[#27332A] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }} />
                      </div>
                      <p className="text-[11px] font-semibold mt-1" style={{ color: passwordStrength.color }}>{passwordStrength.label}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="signup-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      className={`w-full h-[52px] px-4 pr-12 rounded-[14px] border bg-[#F5F6F5] dark:bg-[#202922] text-[14px] font-medium text-[#171917] dark:text-[#F0F5F2] placeholder-[#AAAAAA] focus:outline-none focus:bg-white dark:focus:bg-[#181F1A] focus:ring-2 transition-all ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-[#D95353] focus:border-[#D95353] focus:ring-[#D95353]/12'
                          : 'border-[#EEEEEE] dark:border-[#27332A] focus:border-[#079B48] focus:ring-[#079B48]/12'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777D79] hover:text-[#171917] dark:hover:text-white transition-colors"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                      <IconsaxIcon name={showConfirm ? "eye" : "eye-slash"} size={18} />
                    </button>
                  </div>
                </div>

                <button
                  id="signup-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[48px] rounded-[30px] bg-[#014C32] hover:bg-[#038B5C] text-white text-[15px] font-bold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#014C32]/20 mt-1"
                >
                  {isSubmitting ? (
                    <>
                      <IconsaxIcon name="loading" size={16} color="white" />
                      Creating account...
                    </>
                  ) : 'Create Account'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[13px] text-[#777D79] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#079B48] hover:text-[#087F3C] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

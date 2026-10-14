import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * SMILE FOOD — Auth Context
 * Manages authentication state, user roles, and Supabase session.
 * Supports: Email/Password auth, Google OAuth, Password Reset, Multi-role signup.
 */

const AuthContext = createContext();

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  RIDER: 'rider',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // ─── Initialize session on mount ───────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          }
        }
      } catch (err) {
        console.warn('Supabase not configured — using demo mode:', err.message);
        // Demo mode: load from localStorage
        const savedUser = localStorage.getItem('smilefood_demo_user');
        if (savedUser && mounted) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setProfile(parsed.profile);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      });
      subscription = data?.subscription;
    } catch (err) {
      console.warn('Auth state listener unavailable in demo mode');
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // ─── Fetch user profile from Supabase ──────────────────────────────────────
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      // Profile might not exist yet or Supabase not configured
      console.warn('Could not fetch profile:', err.message);
    }
  };

  // ─── Email/Password Sign Up (Multi-Role) ───────────────────────────────────
  const signUp = async ({ email, password, fullName, role = ROLES.CUSTOMER }) => {
    setAuthError(null);
    setLoading(true);
    try {
      // Try real Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          },
        },
      });

      if (error) throw error;

      // Upsert profile in the profiles table
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          role,
          wallet_balance: 0.00,
        });
      }

      return { success: true, data };
    } catch (err) {
      // Demo mode fallback
      if (err.message.includes('fetch') || err.message.includes('placeholder')) {
        return demoSignUp({ email, password, fullName, role });
      }
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Email/Password Sign In ─────────────────────────────────────────────────
  const signIn = async ({ email, password }) => {
    setAuthError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      // Demo mode fallback
      if (err.message.includes('fetch') || err.message.includes('placeholder') || err.message.includes('Invalid API key')) {
        return demoSignIn({ email, password });
      }
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Google OAuth Sign In ───────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      setAuthError('Google OAuth requires a live Supabase project. Please use email/password in demo mode.');
      return { success: false, error: err.message };
    }
  };

  // ─── Forgot Password ────────────────────────────────────────────────────────
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      // Demo mode: simulate success
      if (err.message.includes('fetch') || err.message.includes('placeholder') || err.message.includes('Invalid API key')) {
        return { success: true, demo: true };
      }
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ─── Update Password (from reset link) ─────────────────────────────────────
  const updatePassword = async (newPassword) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ─── Sign Out ───────────────────────────────────────────────────────────────
  const signOut = async () => {
    setAuthError(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Demo mode
    }
    localStorage.removeItem('smilefood_demo_user');
    setUser(null);
    setProfile(null);
  };

  // ─── Demo Mode Fallbacks ────────────────────────────────────────────────────
  const demoSignUp = ({ email, password, fullName, role }) => {
    const demoUser = {
      id: `demo_${Date.now()}`,
      email,
      user_metadata: { full_name: fullName, role },
      profile: { id: `demo_${Date.now()}`, full_name: fullName, role, wallet_balance: 250.00 },
    };
    localStorage.setItem('smilefood_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setProfile(demoUser.profile);
    return { success: true, demo: true };
  };

  // ─── Supported Verified Demo Accounts ──────────────────────────────────────
  const DEMO_ACCOUNTS = {
    [ROLES.ADMIN]: {
      id: 'demo_admin_001',
      email: 'admin@smilefood.com',
      user_metadata: { full_name: 'Mike Adeleke', role: ROLES.ADMIN },
      profile: { id: 'demo_admin_001', full_name: 'Mike Adeleke', role: ROLES.ADMIN, wallet_balance: 1500.00 }
    },
    [ROLES.CUSTOMER]: {
      id: 'demo_customer_001',
      email: 'customer@smilefood.com',
      user_metadata: { full_name: 'Adeola Williams', role: ROLES.CUSTOMER },
      profile: { id: 'demo_customer_001', full_name: 'Adeola Williams', role: ROLES.CUSTOMER, wallet_balance: 320.00 }
    },
    [ROLES.VENDOR]: {
      id: 'demo_vendor_001',
      email: 'vendor@smilefood.com',
      user_metadata: { full_name: 'Mama Cass Restaurant', role: ROLES.VENDOR },
      profile: { id: 'demo_vendor_001', full_name: 'Mama Cass Restaurant', role: ROLES.VENDOR, wallet_balance: 4250.00 }
    },
    [ROLES.RIDER]: {
      id: 'demo_rider_001',
      email: 'rider@smilefood.com',
      user_metadata: { full_name: 'Tunde Bakare', role: ROLES.RIDER },
      profile: { id: 'demo_rider_001', full_name: 'Tunde Bakare', role: ROLES.RIDER, wallet_balance: 680.00 }
    }
  };

  const demoSignIn = (roleOrEmail = ROLES.ADMIN) => {
    let target = DEMO_ACCOUNTS[ROLES.ADMIN];
    const key = typeof roleOrEmail === 'object' ? roleOrEmail?.email : roleOrEmail;
    if (typeof key === 'string') {
      if (DEMO_ACCOUNTS[key]) {
        target = DEMO_ACCOUNTS[key];
      } else if (key.includes('customer') || key.includes('adeola')) {
        target = DEMO_ACCOUNTS[ROLES.CUSTOMER];
      } else if (key.includes('vendor') || key.includes('restaurant')) {
        target = DEMO_ACCOUNTS[ROLES.VENDOR];
      } else if (key.includes('rider') || key.includes('courier') || key.includes('tunde')) {
        target = DEMO_ACCOUNTS[ROLES.RIDER];
      }
    }
    localStorage.setItem('smilefood_demo_user', JSON.stringify(target));
    setUser(target);
    setProfile(target.profile);
    return { success: true, demo: true, role: target.profile.role };
  };

  // ─── Backend Authorization Verification Helper ────────────────────────────
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    return userRole === requiredRole;
  };

  const verifyActionAuthorization = (requiredRole, actionDescription) => {
    if (!user) {
      return { authorized: false, status: 401, error: 'Authentication required. Please log in.' };
    }
    if (userRole !== requiredRole) {
      return { authorized: false, status: 403, error: `Forbidden: ${actionDescription || 'Operation'} requires ${requiredRole} clearance.` };
    }
    return { authorized: true, status: 200 };
  };

  // ─── Computed helpers ───────────────────────────────────────────────────────
  const rawRole = profile?.role || user?.user_metadata?.role || ROLES.ADMIN;
  // Normalize courier alias to rider
  const userRole = rawRole === 'courier' ? ROLES.RIDER : rawRole;
  const isAuthenticated = !!user;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const walletBalance = profile?.wallet_balance ?? 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        setAuthError,
        isAuthenticated,
        userRole,
        displayName,
        walletBalance,
        signUp,
        signIn,
        signInWithGoogle,
        resetPassword,
        updatePassword,
        signOut,
        fetchProfile,
        demoSignIn,
        hasPermission,
        verifyActionAuthorization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthProvider;

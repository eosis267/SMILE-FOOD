import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';

/**
 * SMILE FOOD — RBAC Route Guard
 * Enforces role-based permissions across /admin, /customer, /vendor, /rider.
 * Automatically reroutes unauthorized users to their designated role portal.
 */
export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#079B48] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-bold text-[#777D79]">Verifying security credentials...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> redirect to login with return path
  if (!user) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to user's assigned portal
    const fallbackPath = {
      [ROLES.ADMIN]: '/admin',
      [ROLES.CUSTOMER]: '/customer',
      [ROLES.VENDOR]: '/vendor',
      [ROLES.RIDER]: '/rider',
    }[userRole] || '/customer';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;

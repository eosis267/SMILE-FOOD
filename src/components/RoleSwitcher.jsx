import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import IconsaxIcon from './IconsaxIcon';

/**
 * SMILE FOOD — Interactive Portal Role Switcher
 * Supports compact (sidebar) and full (header) layouts.
 * - Admin Portal (/admin)
 * - Customer Marketplace (/customer)
 * - Vendor Kitchen Portal (/vendor)
 * - Rider Dispatch Hub (/rider)
 */
export const RoleSwitcher = ({ compact = false }) => {
  const { userRole, switchRole } = useAuth();
  const navigate = useNavigate();

  const roleConfigs = [
    { id: ROLES.ADMIN, label: 'Admin', icon: 'shield-check', path: '/admin', color: '#079B48' },
    { id: ROLES.CUSTOMER, label: 'Customer', icon: 'user', path: '/customer', color: '#087F3C' },
    { id: ROLES.VENDOR, label: 'Vendor', icon: 'shop', path: '/vendor', color: '#F28C00' },
    { id: ROLES.RIDER, label: 'Rider', icon: 'scooter', path: '/rider', color: '#079B48' },
  ];

  const handleRoleChange = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-1.5">
        {roleConfigs.map((role) => {
          const isActive = userRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id, role.path)}
              title={`Switch to ${role.label} Portal`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-[#079B48] text-white shadow-sm'
                  : 'bg-white dark:bg-[#181F1A] text-[#777D79] dark:text-[#8E9A92] hover:text-[#079B48] border border-[#EEEEEE] dark:border-[#27332A]'
              }`}
            >
              <IconsaxIcon name={role.icon} size={12} color={isActive ? 'white' : 'currentColor'} />
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#EAF8D8] dark:bg-[#14301C] border border-[#D5F28A]/40 shadow-xs">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#079B48] dark:text-[#D5F28A] px-2 hidden lg:inline-block">
        Role:
      </span>
      {roleConfigs.map((role) => {
        const isActive = userRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id, role.path)}
            title={`Switch to ${role.label} Portal (${role.path})`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              isActive
                ? 'bg-[#079B48] text-white shadow-sm scale-[1.02]'
                : 'text-[#079B48] dark:text-[#D5F28A] hover:bg-white/60 dark:hover:bg-[#202922]'
            }`}
          >
            <IconsaxIcon name={role.icon} size={13} color={isActive ? 'white' : 'currentColor'} />
            <span>{role.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSwitcher;
